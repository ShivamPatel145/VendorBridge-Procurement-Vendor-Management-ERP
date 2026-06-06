import prisma from '../../config/database';

export class ActivityLogger {
  public static async log(params: {
    userId: string;
    action: string;
    entity: string;
    entityId: string;
    metadata?: any;
    ipAddress?: string;
  }): Promise<void> {
    try {
      await prisma.activityLog.create({
        data: {
          userId: params.userId,
          action: params.action,
          entity: params.entity,
          entityId: params.entityId,
          metadata: params.metadata || {},
          ipAddress: params.ipAddress,
        },
      });
    } catch (err) {
      console.error('❌ Failed to create activity log:', err);
    }
  }
}

export default ActivityLogger;
