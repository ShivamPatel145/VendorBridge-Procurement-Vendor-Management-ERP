import { Request, Response, NextFunction } from 'express';
import { InvoicesService } from './invoices.service';
import {
  createInvoiceSchema,
  updateInvoiceSchema,
  recordPaymentSchema,
  queryInvoiceSchema,
} from './invoices.validator';
import prisma from '../../config/database';
import { PDFService } from '../../shared/services/pdf.service';

export class InvoicesController {
  public static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = queryInvoiceSchema.parse(req.query);
      const page = parseInt(query.page, 10);
      const limit = parseInt(query.limit, 10);

      let actualVendorId: string | undefined;

      if (req.user!.role === 'VENDOR') {
        const vendor = await prisma.vendor.findFirst({
          where: { userId: req.user!.userId },
        });
        if (vendor) {
          actualVendorId = vendor.id;
        }
      }

      const result = await InvoicesService.listInvoices({
        status: query.status,
        invoiceNumber: query.invoiceNumber,
        vendorId: actualVendorId,
        page,
        limit,
      });

      res.status(200).json({
        success: true,
        data: result.invoices,
        meta: {
          page,
          limit,
          total: result.total,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  public static async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await InvoicesService.getInvoice(id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { poId, dueDate } = createInvoiceSchema.parse(req.body);
      const actorId = req.user!.userId;
      const result = await InvoicesService.generateFromPO(poId, dueDate, actorId, req.ip);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data = updateInvoiceSchema.parse(req.body);
      const actorId = req.user!.userId;
      const result = await InvoicesService.updateInvoice(id, data, actorId, req.ip);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async pay(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { amount, method, reference } = recordPaymentSchema.parse(req.body);
      const actorId = req.user!.userId;
      const result = await InvoicesService.recordPayment(id, amount, method, reference, actorId, req.ip);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async downloadPDF(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const invoice = await InvoicesService.getInvoice(id);
      if (!invoice) {
        res.status(404).json({ success: false, message: 'Invoice not found' });
        return;
      }
      const pdfBuffer = await PDFService.generateInvoicePDF(invoice);
      const filename = `${invoice.invoiceNumber ?? id}.pdf`;
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length,
      });
      res.send(pdfBuffer);
    } catch (err) {
      next(err);
    }
  }
}

export default InvoicesController;
