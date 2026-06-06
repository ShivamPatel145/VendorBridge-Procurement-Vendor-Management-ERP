import { Request, Response, NextFunction } from 'express';
import { POService } from './po.service';
import { updatePOSchema, queryPOSchema } from './po.validator';
import prisma from '../../config/database';
import { PDFService } from '../../shared/services/pdf.service';

export class POController {
  public static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = queryPOSchema.parse(req.query);
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

      const result = await POService.listPOs({
        status: query.status,
        poNumber: query.poNumber,
        vendorId: actualVendorId,
        page,
        limit,
      });

      res.status(200).json({
        success: true,
        data: result.pos,
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
      const result = await POService.getPO(id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data = updatePOSchema.parse(req.body);
      const actorId = req.user!.userId;
      const result = await POService.updatePO(id, data, actorId, req.ip);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async generate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { quotationId } = req.body;
      if (!quotationId) {
        res.status(400).json({ success: false, message: 'Quotation ID is required' });
        return;
      }
      const actorId = req.user!.userId;
      const result = await POService.generateFromQuotation(quotationId, actorId, req.ip);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async acknowledge(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const actorId = req.user!.userId;
      const result = await POService.updatePO(id, { status: 'ACKNOWLEDGED' as any }, actorId, req.ip);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async downloadPDF(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const po = await POService.getPO(id);
      if (!po) {
        res.status(404).json({ success: false, message: 'Purchase Order not found' });
        return;
      }
      const pdfBuffer = await PDFService.generatePurchaseOrderPDF(po);
      const filename = `${po.poNumber ?? id}.pdf`;
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

export default POController;
