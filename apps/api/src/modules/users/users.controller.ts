import { Request, Response, NextFunction } from 'express';
import { UsersService } from './users.service';
import { createUserSchema, updateUserSchema, queryUserSchema } from './users.validator';

export class UsersController {
  public static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = queryUserSchema.parse(req.query);
      const page = parseInt(query.page, 10);
      const limit = parseInt(query.limit, 10);

      const result = await UsersService.listUsers({
        role: query.role,
        search: query.search,
        page,
        limit,
      });

      res.status(200).json({
        success: true,
        data: result.users,
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
      const result = await UsersService.getUser(id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = createUserSchema.parse(req.body);
      const actorId = req.user!.userId;
      const result = await UsersService.createUser(data, actorId, req.ip);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data = updateUserSchema.parse(req.body);
      const actorId = req.user!.userId;
      const result = await UsersService.updateUser(id, data, actorId, req.ip);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const actorId = req.user!.userId;
      await UsersService.deleteUser(id, actorId, req.ip);
      res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}

export default UsersController;
