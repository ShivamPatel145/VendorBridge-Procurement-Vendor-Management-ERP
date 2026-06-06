import prisma from '../../config/database';
import { Prisma } from '@prisma/client';

export class ReportsRepository {
  public static async getSpendByVendorMonthly(): Promise<any[]> {
    return prisma.$queryRaw`
      SELECT 
        v.company_name as "companyName",
        DATE_TRUNC('month', po.created_at) as "month",
        SUM(po.total_amount) as "totalSpend"
      FROM purchase_orders po
      JOIN quotations q ON po.quotation_id = q.id
      JOIN vendors v ON q.vendor_id = v.id
      WHERE po.deleted_at IS NULL AND po.status != 'CANCELLED'
      GROUP BY v.company_name, DATE_TRUNC('month', po.created_at)
      ORDER BY "month" DESC, "totalSpend" DESC
    `;
  }

  public static async getRFQResponseRate(): Promise<any[]> {
    return prisma.$queryRaw`
      SELECT 
        r.id as "rfqId",
        r.title as "title",
        COUNT(DISTINCT rv.vendor_id) as "invitedCount",
        COUNT(DISTINCT q.id) as "responseCount",
        CASE 
          WHEN COUNT(DISTINCT rv.vendor_id) = 0 THEN 0
          ELSE ROUND((COUNT(DISTINCT q.id)::numeric / COUNT(DISTINCT rv.vendor_id)::numeric) * 100, 2)
        END as "responseRate"
      FROM rfqs r
      LEFT JOIN rfq_vendors rv ON r.id = rv.rfq_id
      LEFT JOIN quotations q ON r.id = q.rfq_id AND q.status != 'DRAFT' AND q.deleted_at IS NULL
      WHERE r.deleted_at IS NULL
      GROUP BY r.id, r.title, r.created_at
      ORDER BY r.created_at DESC
    `;
  }

  public static async getPOInvoiceStatusSummary(): Promise<any> {
    const poSummary = await prisma.purchaseOrder.groupBy({
      by: ['status'],
      _count: { _all: true },
      _sum: { totalAmount: true },
      where: { deletedAt: null },
    });

    const invoiceSummary = await prisma.invoice.groupBy({
      by: ['status'],
      _count: { _all: true },
      _sum: { totalAmount: true },
      where: { deletedAt: null },
    });

    return {
      po: poSummary.map((s) => ({
        status: s.status,
        count: s._count._all,
        totalAmount: Number(s._sum.totalAmount || 0),
      })),
      invoice: invoiceSummary.map((s) => ({
        status: s.status,
        count: s._count._all,
        totalAmount: Number(s._sum.totalAmount || 0),
      })),
    };
  }

  public static async listActivityLogs(params: {
    search?: string;
    page: number;
    limit: number;
  }): Promise<{ logs: any[]; total: number }> {
    const { search, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.ActivityLogWhereInput = search
      ? {
          OR: [
            { action: { contains: search, mode: 'insensitive' } },
            { entity: { contains: search, mode: 'insensitive' } },
            { user: { name: { contains: search, mode: 'insensitive' } } },
          ],
        }
      : {};

    const [logs, total] = await prisma.$transaction([
      prisma.activityLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true, role: true } },
        },
      }),
      prisma.activityLog.count({ where }),
    ]);

    return { logs, total };
  }
}

export default ReportsRepository;
