import prisma from '../../config/database';
import { Prisma, Notification } from '@prisma/client';

export class NotificationsRepository {
  public static async create(data: Prisma.NotificationUncheckedCreateInput): Promise<Notification> {
    return prisma.notification.create({ data });
  }

  public static async list(params: {
    userId: string;
    page: number;
    limit: number;
  }): Promise<{ notifications: Notification[]; total: number }> {
    const { userId, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.NotificationWhereInput = { userId };

    const [notifications, total] = await prisma.$transaction([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where }),
    ]);

    return { notifications, total };
  }

  public static async markRead(id: string, userId: string): Promise<Notification> {
    return prisma.notification.update({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  public static async markAllRead(userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  public static async getUnreadCount(userId: string): Promise<number> {
    return prisma.notification.count({
      where: { userId, isRead: false },
    });
  }
}

export default NotificationsRepository;
