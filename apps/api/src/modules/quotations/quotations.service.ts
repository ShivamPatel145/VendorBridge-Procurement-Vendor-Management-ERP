import { QuotationsRepository } from './quotations.repository';
import { CloudinaryService } from '../../shared/services/cloudinary.service';
import { NotFoundError, ValidationError, ForbiddenError } from '../../shared/errors/AppError';
import { ActivityLogger } from '../../shared/utils/activityLogger';
import prisma from '../../config/database';

export class QuotationsService {
  public static async createQuotation(data: any, userId: string, ipAddress?: string) {
    const vendor = await prisma.vendor.findFirst({ where: { userId } });
    if (!vendor) {
      throw new ForbiddenError('Only registered vendors can create quotations');
    }

    if (vendor.status !== 'APPROVED') {
      throw new ForbiddenError('Your vendor profile must be approved to submit quotations');
    }

    const rfq = await prisma.rFQ.findUnique({ where: { id: data.rfqId } });
    if (!rfq) {
      throw new NotFoundError('RFQ');
    }

    if (rfq.status !== 'PUBLISHED') {
      throw new ValidationError('You can only submit quotations for published RFQs');
    }

    const quotation = await QuotationsRepository.create(
      {
        rfqId: data.rfqId,
        vendorId: vendor.id,
        notes: data.notes,
        validUntil: data.validUntil,
        status: 'DRAFT',
      },
      data.items
    );

    await ActivityLogger.log({
      userId,
      action: 'CREATE_QUOTATION_DRAFT',
      entity: 'Quotation',
      entityId: quotation.id,
      ipAddress,
    });

    return QuotationsRepository.findById(quotation.id);
  }

  public static async updateQuotation(id: string, data: any, userId: string, userRole: string, ipAddress?: string) {
    const quotation = await QuotationsRepository.findById(id);
    if (!quotation) {
      throw new NotFoundError('Quotation');
    }

    const vendor = await prisma.vendor.findFirst({ where: { userId } });
    if (userRole !== 'ADMIN' && userRole !== 'MANAGER' && (!vendor || vendor.id !== quotation.vendorId)) {
      throw new ForbiddenError('You do not have permission to modify this quotation');
    }

    const { items, status, ...rest } = data;
    const updates: any = { ...rest };

    if (status) {
      updates.status = status;
      if (status === 'SUBMITTED') {
        updates.submittedAt = new Date();
      }
    }

    const updated = await QuotationsRepository.update(id, updates, items);

    if (status === 'SUBMITTED') {
      const rfq = await prisma.rFQ.findUnique({ where: { id: quotation.rfqId } });
      if (rfq) {
        if (rfq.status === 'PUBLISHED') {
          await prisma.rFQ.update({
            where: { id: rfq.id },
            data: { status: 'EVALUATING' },
          });
        }

        await prisma.notification.create({
          data: {
            userId: rfq.createdById,
            type: 'QUOTATION_RECEIVED',
            title: 'Quotation Submitted',
            message: `Vendor "${quotation.vendor.companyName}" submitted a quotation for RFQ: "${rfq.title}"`,
            link: `/rfqs/${rfq.id}`,
          },
        });
      }
    }

    await ActivityLogger.log({
      userId,
      action: `UPDATE_QUOTATION_${status || 'EDIT'}`,
      entity: 'Quotation',
      entityId: id,
      ipAddress,
    });

    return QuotationsRepository.findById(id);
  }

  public static async uploadAttachment(
    quotationId: string,
    buffer: Buffer,
    filename: string,
    mimetype: string,
    userId: string,
    ipAddress?: string
  ) {
    const quotation = await QuotationsRepository.findById(quotationId);
    if (!quotation) {
      throw new NotFoundError('Quotation');
    }

    const resourceType = mimetype.startsWith('image/') ? 'image' : 'raw';
    const uploadResult = await CloudinaryService.uploadBuffer(
      buffer,
      `quotations/${quotationId}`,
      filename,
      resourceType
    );

    const attachment = await QuotationsRepository.createAttachment({
      quotationId,
      fileName: filename,
      fileUrl: uploadResult.url,
    });

    await ActivityLogger.log({
      userId,
      action: 'UPLOAD_QUOTATION_ATTACHMENT',
      entity: 'QuotationAttachment',
      entityId: attachment.id,
      ipAddress,
    });

    return attachment;
  }

  public static async listQuotations(params: any) {
    return QuotationsRepository.list(params);
  }

  public static async getQuotation(id: string) {
    const quotation = await QuotationsRepository.findById(id);
    if (!quotation) {
      throw new NotFoundError('Quotation');
    }
    return quotation;
  }

  public static async compareQuotations(rfqId: string) {
    const rfq = await prisma.rFQ.findUnique({
      where: { id: rfqId },
      include: { items: true },
    });
    if (!rfq) {
      throw new NotFoundError('RFQ');
    }

    const quotations = await QuotationsRepository.getComparisonData(rfqId);

    const vendors = quotations.map((q) => ({
      id: q.vendor.id,
      companyName: q.vendor.companyName,
      rating: q.vendor.rating,
      totalAmount: q.totalAmount,
      quotationId: q.id,
    }));

    const comparisonMatrix = rfq.items.map((rfqItem) => {
      const bids: Record<string, { unitPrice: number; totalPrice: number }> = {};
      
      for (const q of quotations) {
        const qItem = q.items.find(
          (qi: any) => qi.rfqItemId === rfqItem.id || qi.description.toLowerCase() === rfqItem.description.toLowerCase()
        );
        if (qItem) {
          bids[q.vendor.id] = {
            unitPrice: Number(qItem.unitPrice),
            totalPrice: Number(qItem.totalPrice),
          };
        }
      }

      return {
        rfqItemId: rfqItem.id,
        description: rfqItem.description,
        quantity: rfqItem.quantity,
        unit: rfqItem.unit,
        bids,
      };
    });

    return {
      rfq: {
        id: rfq.id,
        title: rfq.title,
        status: rfq.status,
      },
      vendors,
      comparisonMatrix,
    };
  }
}

export default QuotationsService;
