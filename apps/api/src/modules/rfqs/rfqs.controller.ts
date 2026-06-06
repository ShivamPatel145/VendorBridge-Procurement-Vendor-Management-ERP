import { Request, Response, NextFunction } from 'express';
import { RFQsService } from './rfqs.service';
import { createRFQSchema, updateRFQSchema, inviteVendorsSchema, queryRFQSchema } from './rfqs.validator';
import prisma from '../../config/database';

export class RFQsController {
  public static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = queryRFQSchema.parse(req.query);
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

      const result = await RFQsService.listRFQs({
        status: query.status,
        search: query.search,
        vendorId: actualVendorId,
        page,
        limit,
      });

      res.status(200).json({
        success: true,
        data: result.rfqs,
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
      const result = await RFQsService.getRFQ(id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = createRFQSchema.parse(req.body);
      const actorId = req.user!.userId;
      const result = await RFQsService.createRFQ(data, actorId, req.ip);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data = updateRFQSchema.parse(req.body);
      const actorId = req.user!.userId;
      const result = await RFQsService.updateRFQ(id, data, actorId, req.ip);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async publish(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const actorId = req.user!.userId;
      const result = await RFQsService.publishRFQ(id, actorId, req.ip);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async close(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const actorId = req.user!.userId;
      const result = await RFQsService.closeRFQ(id, actorId, req.ip);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async invite(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { vendorIds } = inviteVendorsSchema.parse(req.body);
      const actorId = req.user!.userId;
      await RFQsService.inviteVendors(id, vendorIds, actorId, req.ip);
      res.status(200).json({ success: true, message: 'Vendors invited successfully' });
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
      const actorId = req.user!.userId;
      const result = await RFQsService.uploadAttachment(
        id,
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        actorId,
        req.ip
      );
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}

export default RFQsController;
