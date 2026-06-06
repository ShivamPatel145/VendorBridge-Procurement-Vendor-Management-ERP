import { NotificationsRepository } from './notifications.repository';

export class NotificationsService {
  public static async listNotifications(userId: string, page: number, limit: number) {
    return NotificationsRepository.list({ userId, page, limit });
  }

  public static async markRead(id: string, userId: string) {
    return NotificationsRepository.markRead(id, userId);
  }

  public static async markAllRead(userId: string) {
    await NotificationsRepository.markAllRead(userId);
  }

  public static async getUnreadCount(userId: string) {
    const count = await NotificationsRepository.getUnreadCount(userId);
    return { unreadCount: count };
  }
}

export default NotificationsService;
