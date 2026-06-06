import { Request, Response, NextFunction } from 'express';
import { VendorsService } from './vendors.service';
import {
  updateVendorSchema,
  updateVendorStatusSchema,
  categorySchema,
  queryVendorSchema,
} from './vendors.validator';

export class VendorsController {
  public static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = queryVendorSchema.parse(req.query);
      const page = parseInt(query.page, 10);
      const limit = parseInt(query.limit, 10);

      const result = await VendorsService.listVendors({
        status: query.status,
        categoryId: query.categoryId,
        search: query.search,
        page,
        limit,
      });

      res.status(200).json({
        success: true,
        data: result.vendors,
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
      const result = await VendorsService.getVendor(id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async getMyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const actorId = req.user!.userId;
      const result = await VendorsService.getVendorByUserId(actorId);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data = updateVendorSchema.parse(req.body);
      const actorId = req.user!.userId;
      const result = await VendorsService.updateVendor(id, data, actorId, req.ip);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = updateVendorStatusSchema.parse(req.body);
      const actorId = req.user!.userId;
      const result = await VendorsService.updateVendorStatus(id, status, actorId, req.ip);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async uploadDoc(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded' });
        return;
      }
      const actorId = req.user!.userId;
      const result = await VendorsService.uploadDocument(
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

  // Categories
  public static async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = categorySchema.parse(req.body);
      const actorId = req.user!.userId;
      const result = await VendorsService.createCategory(data, actorId, req.ip);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async listCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await VendorsService.listCategories();
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const actorId = req.user!.userId;
      await VendorsService.deleteCategory(id, actorId, req.ip);
      res.status(200).json({ success: true, message: 'Category deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}

export default VendorsController;
