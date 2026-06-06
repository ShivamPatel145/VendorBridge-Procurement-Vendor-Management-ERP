import { PORepository } from './po.repository';
import { PDFService } from '../../shared/services/pdf.service';
import { CloudinaryService } from '../../shared/services/cloudinary.service';
import { EmailService } from '../../shared/services/email.service';
import { NotFoundError, ValidationError } from '../../shared/errors/AppError';
import { ActivityLogger } from '../../shared/utils/activityLogger';
import prisma from '../../config/database';

export class POService {
  public static async generateFromQuotation(quotationId: string, creatorId: string, ipAddress?: string) {
    const quotation = await prisma.quotation.findFirst({
      where: { id: quotationId, deletedAt: null },
      include: {
        items: true,
        vendor: true,
        rfq: true,
      },
    });

    if (!quotation) {
      throw new NotFoundError('Quotation');
    }

    if (quotation.status !== 'ACCEPTED') {
      throw new ValidationError('Quotation must be accepted to generate a Purchase Order');
    }

    // Check if PO already exists for this quotation
    const existing = await prisma.purchaseOrder.findFirst({
      where: { quotationId, deletedAt: null },
    });
    if (existing) {
      return existing;
    }

    // Generate PO number: PO-YYYY-0001
    const year = new Date().getFullYear();
    const poCount = await PORepository.getPoCountThisYear();
    const poNumber = `PO-${year}-${String(poCount + 1).padStart(4, '0')}`;

    // Map items
    const poItems = quotation.items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      totalPrice: Number(item.totalPrice),
    }));

    // Create PO draft
    const po = await PORepository.create(
      {
        poNumber,
        quotationId,
        createdById: creatorId,
        status: 'APPROVED',
        totalAmount: quotation.totalAmount,
        terms: quotation.notes || 'Standard terms apply.',
      },
      poItems
    );

    // Fetch PO with relational fields for PDF template
    const fullPo = await PORepository.findById(po.id);

    // Generate PDF and upload to Cloudinary
    let pdfUrl = '';
    try {
      const pdfBuffer = await PDFService.generatePurchaseOrderPDF(fullPo);
      const uploadResult = await CloudinaryService.uploadBuffer(
        pdfBuffer,
        `pos/${po.id}`,
        `${poNumber}.pdf`,
        'raw'
      );
      pdfUrl = uploadResult.url;

      // Update PO with PDF Url
      await PORepository.update(po.id, { pdfUrl });
      fullPo.pdfUrl = pdfUrl;
    } catch (err) {
      console.error('PDF creation/upload failed for PO:', err);
    }

    // In-app Notification for Vendor
    await prisma.notification.create({
      data: {
        userId: quotation.vendor.userId,
        type: 'PO_GENERATED',
        title: 'New Purchase Order Received',
        message: `A new Purchase Order (${poNumber}) has been generated for RFQ "${quotation.rfq.title}"`,
        link: `/vendor-portal/purchase-orders/${po.id}`,
      },
    });

    // Notify Vendor User Email
    const vendorUser = await prisma.user.findUnique({ where: { id: quotation.vendor.userId } });
    if (vendorUser) {
      await EmailService.sendEmail({
        to: vendorUser.email,
        subject: `New Purchase Order: ${poNumber}`,
        template: 'po_generated',
        html: `
          <h1>Purchase Order Recieved</h1>
          <p>Dear ${quotation.vendor.companyName},</p>
          <p>We are pleased to send you Purchase Order <strong>${poNumber}</strong> details:</p>
          <ul>
            <li><strong>RFQ:</strong> ${quotation.rfq.title}</li>
            <li><strong>Total Amount:</strong> $${Number(quotation.totalAmount).toFixed(2)}</li>
            <li><strong>PDF Link:</strong> <a href="${pdfUrl}">Download Purchase Order PDF</a></li>
          </ul>
          <p>Please log in to the vendor portal to review and acknowledge receipt of the order.</p>
        `,
      });
    }

    await ActivityLogger.log({
      userId: creatorId,
      action: 'GENERATE_PO',
      entity: 'PurchaseOrder',
      entityId: po.id,
      ipAddress,
    });

    return PORepository.findById(po.id);
  }

  public static async updatePO(id: string, data: any, actorId: string, ipAddress?: string) {
    const po = await PORepository.findById(id);
    if (!po) {
      throw new NotFoundError('PurchaseOrder');
    }

    const updated = await PORepository.update(id, data);

    await ActivityLogger.log({
      userId: actorId,
      action: `UPDATE_PO_STATUS_${data.status || 'EDIT'}`,
      entity: 'PurchaseOrder',
      entityId: id,
      ipAddress,
    });

    return PORepository.findById(id);
  }

  public static async getPO(id: string) {
    const po = await PORepository.findById(id);
    if (!po) {
      throw new NotFoundError('PurchaseOrder');
    }
    return po;
  }

  public static async listPOs(params: any) {
    return PORepository.list(params);
  }
}

export default POService;
