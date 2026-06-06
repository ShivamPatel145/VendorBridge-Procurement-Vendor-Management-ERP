import prisma from '../../config/database';
import { Prisma, Quotation, QuotationItem, QuotationAttachment } from '@prisma/client';

export class QuotationsRepository {
  public static async findById(id: string): Promise<any | null> {
    return prisma.quotation.findFirst({
      where: { id, deletedAt: null },
      include: {
        items: true,
        attachments: true,
        vendor: true,
        rfq: true,
        approvals: {
          include: {
            steps: {
              include: {
                actions: {
                  include: {
                    user: {
                      select: { id: true, name: true, email: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  public static async create(
    quotationData: Omit<Prisma.QuotationUncheckedCreateInput, 'totalAmount'>,
    items: { rfqItemId?: string; description: string; quantity: number; unitPrice: number }[]
  ): Promise<Quotation> {
    return prisma.$transaction(async (tx) => {
      let totalAmount = new Prisma.Decimal(0);
      const computedItems = items.map((item) => {
        const lineTotal = new Prisma.Decimal(item.quantity).mul(new Prisma.Decimal(item.unitPrice));
        totalAmount = totalAmount.add(lineTotal);
        return {
          description: item.description,
          quantity: item.quantity,
          unitPrice: new Prisma.Decimal(item.unitPrice),
          totalPrice: lineTotal,
          rfqItemId: item.rfqItemId,
        };
      });

      const quotation = await tx.quotation.create({
        data: {
          ...quotationData,
          totalAmount,
        },
      });

      await tx.quotationItem.createMany({
        data: computedItems.map((item) => ({
          ...item,
          quotationId: quotation.id,
        })),
      });

      return quotation;
    });
  }

  public static async update(
    id: string,
    quotationData: Prisma.QuotationUpdateInput,
    items?: { id?: string; rfqItemId?: string; description?: string; quantity?: number; unitPrice?: number }[]
  ): Promise<Quotation> {
    return prisma.$transaction(async (tx) => {
      if (items) {
        let totalAmount = new Prisma.Decimal(0);
        await tx.quotationItem.deleteMany({ where: { quotationId: id } });
        
        const computedItems = items.map((item) => {
          const qty = item.quantity ?? 1;
          const price = item.unitPrice ?? 0;
          const lineTotal = new Prisma.Decimal(qty).mul(new Prisma.Decimal(price));
          totalAmount = totalAmount.add(lineTotal);
          return {
            quotationId: id,
            description: item.description || '',
            quantity: qty,
            unitPrice: new Prisma.Decimal(price),
            totalPrice: lineTotal,
            rfqItemId: item.rfqItemId,
          };
        });

        await tx.quotationItem.createMany({
          data: computedItems,
        });

        return tx.quotation.update({
          where: { id },
          data: {
            ...quotationData,
            totalAmount,
          },
        });
      }

      return tx.quotation.update({
        where: { id },
        data: quotationData,
      });
    });
  }

  public static async delete(id: string): Promise<Quotation> {
    return prisma.quotation.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  public static async createAttachment(data: Prisma.QuotationAttachmentUncheckedCreateInput): Promise<QuotationAttachment> {
    return prisma.quotationAttachment.create({ data });
  }

  public static async list(params: {
    rfqId?: string;
    vendorId?: string;
    status?: string;
    page: number;
    limit: number;
  }): Promise<{ quotations: any[]; total: number }> {
    const { rfqId, vendorId, status, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.QuotationWhereInput = {
      deletedAt: null,
      ...(rfqId ? { rfqId } : {}),
      ...(vendorId ? { vendorId } : {}),
      ...(status ? { status: status as any } : {}),
    };

    const [quotations, total] = await prisma.$transaction([
      prisma.quotation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          vendor: true,
          rfq: {
            select: { id: true, title: true, status: true },
          },
        },
      }),
      prisma.quotation.count({ where }),
    ]);

    return { quotations, total };
  }

  public static async getComparisonData(rfqId: string): Promise<any[]> {
    return prisma.quotation.findMany({
      where: {
        rfqId,
        status: { in: ['SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED'] },
        deletedAt: null,
      },
      include: {
        vendor: true,
        items: true,
      },
    });
  }
}

export default QuotationsRepository;
