import { Request, Response, NextFunction } from 'express';
import { QuotationsService } from './quotations.service';
import { createQuotationSchema, updateQuotationSchema, queryQuotationSchema } from './quotations.validator';
import prisma from '../../config/database';

export class QuotationsController {
  public static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = queryQuotationSchema.parse(req.query);
      const page = parseInt(query.page, 10);
      const limit = parseInt(query.limit, 10);

      let actualVendorId = query.vendorId;
      if (req.user!.role === 'VENDOR') {
        const vendor = await prisma.vendor.findFirst({
          where: { userId: req.user!.userId },
        });
        if (vendor) {
          actualVendorId = vendor.id;
        }
      }

      const result = await QuotationsService.listQuotations({
        rfqId: query.rfqId,
        vendorId: actualVendorId,
        status: query.status,
        page,
        limit,
      });

      res.status(200).json({
        success: true,
        data: result.quotations,
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
      const result = await QuotationsService.getQuotation(id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = createQuotationSchema.parse(req.body);
      const userId = req.user!.userId;
      const result = await QuotationsService.createQuotation(data, userId, req.ip);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data = updateQuotationSchema.parse(req.body);
      const userId = req.user!.userId;
      const userRole = req.user!.role;
      const result = await QuotationsService.updateQuotation(id, data, userId, userRole, req.ip);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async uploadAttachment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded' });
        return;
      }
      const userId = req.user!.userId;
      const result = await QuotationsService.uploadAttachment(
        id,
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        userId,
        req.ip
      );
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async compare(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { rfqId } = req.params;
      const result = await QuotationsService.compareQuotations(rfqId);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}

export default QuotationsController;
