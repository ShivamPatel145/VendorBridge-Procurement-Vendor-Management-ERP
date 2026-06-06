import { Request, Response, NextFunction } from 'express';
import { NotificationsService } from './notifications.service';
import { queryNotifSchema } from './notifications.validator';

export class NotificationsController {
  public static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = queryNotifSchema.parse(req.query);
      const page = parseInt(query.page, 10);
      const limit = parseInt(query.limit, 10);
      const userId = req.user!.userId;

      const result = await NotificationsService.listNotifications(userId, page, limit);

      res.status(200).json({
        success: true,
        data: result.notifications,
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

  public static async unreadCount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const result = await NotificationsService.getUnreadCount(userId);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async markRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;
      const result = await NotificationsService.markRead(id, userId);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async markAllRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      await NotificationsService.markAllRead(userId);
      res.status(200).json({ success: true, message: 'All notifications marked as read' });
    } catch (err) {
      next(err);
    }
  }
}

export default NotificationsController;
