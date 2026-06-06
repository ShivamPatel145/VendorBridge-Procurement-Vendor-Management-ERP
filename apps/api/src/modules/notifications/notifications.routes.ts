import { Router } from 'express';
import { NotificationsController } from './notifications.controller';
import { authenticate } from '../../middlewares/authenticate';

export const notificationRoutes = Router();

// Secure all notification endpoints
notificationRoutes.use(authenticate);

// List notifications
notificationRoutes.get('/', NotificationsController.list);

// Unread count
notificationRoutes.get('/unread-count', NotificationsController.unreadCount);

// Mark single notification as read
notificationRoutes.patch('/:id/read', NotificationsController.markRead);

// Mark all notifications as read
notificationRoutes.post('/read-all', NotificationsController.markAllRead);

export default notificationRoutes;
