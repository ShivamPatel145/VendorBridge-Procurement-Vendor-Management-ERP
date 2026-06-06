import { InvoicesRepository } from './invoices.repository';
import { PDFService } from '../../shared/services/pdf.service';
import { CloudinaryService } from '../../shared/services/cloudinary.service';
import { EmailService } from '../../shared/services/email.service';
import { NotFoundError, ValidationError, ForbiddenError } from '../../shared/errors/AppError';
import { ActivityLogger } from '../../shared/utils/activityLogger';
import prisma from '../../config/database';

export class InvoicesService {
  public static async generateFromPO(poId: string, dueDate: Date, creatorId: string, ipAddress?: string) {
    const po = await prisma.purchaseOrder.findFirst({
      where: { id: poId, deletedAt: null },
      include: {
        items: true,
        quotation: {
          include: {
            vendor: {
              include: { user: true },
            },
          },
        },
      },
    });

    if (!po) {
      throw new NotFoundError('PurchaseOrder');
    }

    if (po.status !== 'APPROVED' && po.status !== 'SENT') {
      throw new ValidationError('Purchase Order must be approved or sent to generate an invoice');
    }

    const vendor = await prisma.vendor.findFirst({ where: { userId: creatorId } });
    if (po.quotation.vendorId !== vendor?.id) {
      throw new ForbiddenError('You can only generate invoices for your own Purchase Orders');
    }

    const year = new Date().getFullYear();
    const invoiceCount = await InvoicesRepository.getInvoiceCountThisYear();
    const invoiceNumber = `INV-${year}-${String(invoiceCount + 1).padStart(4, '0')}`;

    const invoiceItems = po.items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      totalPrice: Number(item.totalPrice),
    }));

    const invoice = await InvoicesRepository.create(
      {
        invoiceNumber,
        poId,
        createdById: creatorId,
        status: 'PENDING',
        totalAmount: po.totalAmount,
        dueDate,
      },
      invoiceItems
    );

    const fullInvoice = await InvoicesRepository.findById(invoice.id);

    let pdfUrl = '';
    try {
      const pdfBuffer = await PDFService.generateInvoicePDF(fullInvoice);
      const uploadResult = await CloudinaryService.uploadBuffer(
        pdfBuffer,
        `invoices/${invoice.id}`,
        `${invoiceNumber}.pdf`,
        'raw'
      );
      pdfUrl = uploadResult.url;

      await InvoicesRepository.update(invoice.id, { pdfUrl });
      fullInvoice.pdfUrl = pdfUrl;
    } catch (err) {
      console.error('PDF creation/upload failed for Invoice:', err);
    }

    const procurementUser = await prisma.user.findFirst({
      where: { id: po.createdById },
    });
    if (procurementUser) {
      await prisma.notification.create({
        data: {
          userId: procurementUser.id,
          type: 'INVOICE_SENT',
          title: 'New Invoice Received',
          message: `A new invoice (${invoiceNumber}) has been submitted by "${po.quotation.vendor.companyName}"`,
          link: `/invoices/${invoice.id}`,
        },
      });

      await EmailService.sendEmail({
        to: procurementUser.email,
        subject: `New Invoice Received: ${invoiceNumber}`,
        template: 'invoice_received',
        html: `
          <h1>Invoice Received</h1>
          <p>Hi ${procurementUser.name},</p>
          <p>A new invoice has been submitted by vendor <strong>${po.quotation.vendor.companyName}</strong>:</p>
          <ul>
            <li><strong>Invoice Number:</strong> ${invoiceNumber}</li>
            <li><strong>Purchase Order:</strong> ${po.poNumber}</li>
            <li><strong>Amount Due:</strong> $${Number(po.totalAmount).toFixed(2)}</li>
            <li><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</li>
            <li><strong>PDF Link:</strong> <a href="${pdfUrl}">Download Invoice PDF</a></li>
          </ul>
          <p>Please log in to the ERP to process the payment.</p>
        `,
      });
    }

    await ActivityLogger.log({
      userId: creatorId,
      action: 'GENERATE_INVOICE',
      entity: 'Invoice',
      entityId: invoice.id,
      ipAddress,
    });

    return InvoicesRepository.findById(invoice.id);
  }

  public static async recordPayment(
    invoiceId: string,
    amount: number,
    method: string,
    reference: string | undefined,
    actorId: string,
    ipAddress?: string
  ) {
    const invoice = await InvoicesRepository.findById(invoiceId);
    if (!invoice) {
      throw new NotFoundError('Invoice');
    }

    const payment = await InvoicesRepository.createPayment({
      invoiceId,
      amount,
      method,
      reference,
    });

    const vendorUser = await prisma.user.findFirst({
      where: { id: invoice.po.quotation.vendor.userId },
    });
    if (vendorUser) {
      await prisma.notification.create({
        data: {
          userId: vendorUser.id,
          type: 'PAYMENT_RECEIVED',
          title: 'Payment Received',
          message: `We have recorded a payment of $${amount.toFixed(2)} for Invoice (${invoice.invoiceNumber})`,
          link: `/vendor-portal/invoices/${invoiceId}`,
        },
      });

      await EmailService.sendEmail({
        to: vendorUser.email,
        subject: `Payment Recorded: ${invoice.invoiceNumber}`,
        template: 'payment_received',
        html: `
          <h1>Payment Received</h1>
          <p>Dear ${invoice.po.quotation.vendor.companyName},</p>
          <p>We have processed a payment for your invoice <strong>${invoice.invoiceNumber}</strong>:</p>
          <ul>
            <li><strong>Amount Paid:</strong> $${amount.toFixed(2)}</li>
            <li><strong>Payment Method:</strong> ${method}</li>
            <li><strong>Reference:</strong> ${reference || 'N/A'}</li>
          </ul>
          <p>Thank you for your business.</p>
        `,
      });
    }

    await ActivityLogger.log({
      userId: actorId,
      action: 'RECORD_PAYMENT',
      entity: 'Payment',
      entityId: payment.id,
      metadata: { invoiceId, amount, method, reference },
      ipAddress,
    });

    return InvoicesRepository.findById(invoiceId);
  }

  public static async updateInvoice(id: string, data: any, actorId: string, ipAddress?: string) {
    const invoice = await InvoicesRepository.findById(id);
    if (!invoice) {
      throw new NotFoundError('Invoice');
    }

    const updated = await InvoicesRepository.update(id, data);

    await ActivityLogger.log({
      userId: actorId,
      action: `UPDATE_INVOICE_${data.status || 'EDIT'}`,
      entity: 'Invoice',
      entityId: id,
      ipAddress,
    });

    return InvoicesRepository.findById(id);
  }

  public static async getInvoice(id: string) {
    const invoice = await InvoicesRepository.findById(id);
    if (!invoice) {
      throw new NotFoundError('Invoice');
    }
    return invoice;
  }

  public static async listInvoices(params: any) {
    return InvoicesRepository.list(params);
  }
}

export default InvoicesService;
