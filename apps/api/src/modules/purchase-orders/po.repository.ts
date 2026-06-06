import prisma from '../../config/database';
import { Prisma, PurchaseOrder, POItem } from '@prisma/client';

export class PORepository {
  public static async findById(id: string): Promise<any | null> {
    return prisma.purchaseOrder.findFirst({
      where: { id, deletedAt: null },
      include: {
        items: true,
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        quotation: {
          include: {
            vendor: true,
            rfq: true,
          },
        },
        invoices: true,
      },
    });
  }

  public static async create(
    poData: Prisma.PurchaseOrderUncheckedCreateInput,
    items: { description: string; quantity: number; unitPrice: number; totalPrice: number }[]
  ): Promise<PurchaseOrder> {
    return prisma.$transaction(async (tx) => {
      const po = await tx.purchaseOrder.create({
        data: poData,
      });

      await tx.pOItem.createMany({
        data: items.map((item) => ({
          poId: po.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: new Prisma.Decimal(item.unitPrice),
          totalPrice: new Prisma.Decimal(item.totalPrice),
        })),
      });

      return po;
    });
  }

  public static async update(id: string, data: Prisma.PurchaseOrderUpdateInput): Promise<PurchaseOrder> {
    return prisma.purchaseOrder.update({
      where: { id },
      data,
    });
  }

  public static async list(params: {
    status?: string;
    poNumber?: string;
    vendorId?: string;
    page: number;
    limit: number;
  }): Promise<{ pos: any[]; total: number }> {
    const { status, poNumber, vendorId, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.PurchaseOrderWhereInput = {
      deletedAt: null,
      ...(status ? { status: status as any } : {}),
      ...(poNumber ? { poNumber: { contains: poNumber, mode: 'insensitive' } } : {}),
      ...(vendorId
        ? {
            quotation: {
              vendorId,
            },
          }
        : {}),
    };

    const [pos, total] = await prisma.$transaction([
      prisma.purchaseOrder.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          createdBy: { select: { id: true, name: true } },
          quotation: {
            include: {
              vendor: true,
              rfq: { select: { id: true, title: true } },
            },
          },
        },
      }),
      prisma.purchaseOrder.count({ where }),
    ]);

    return { pos, total };
  }

  public static async getPoCountThisYear(): Promise<number> {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    return prisma.purchaseOrder.count({
      where: {
        createdAt: {
          gte: startOfYear,
        },
      },
    });
  }
}

export default PORepository;
