import prisma from '../../config/database';
import { Prisma, RFQ, RFQItem, RFQVendor, RFQAttachment } from '@prisma/client';

export class RFQsRepository {
  public static async findById(id: string): Promise<any | null> {
    return prisma.rFQ.findFirst({
      where: { id, deletedAt: null },
      include: {
        items: true,
        attachments: true,
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        vendors: {
          include: {
            vendor: true,
          },
        },
        quotations: {
          include: {
            vendor: true,
          },
        },
      },
    });
  }

  public static async create(
    rfqData: Prisma.RFQUncheckedCreateInput,
    items: { description: string; quantity: number; unit: string }[]
  ): Promise<RFQ> {
    return prisma.$transaction(async (tx) => {
      const rfq = await tx.rFQ.create({
        data: rfqData,
      });

      await tx.rFQItem.createMany({
        data: items.map((item) => ({
          ...item,
          rfqId: rfq.id,
        })),
      });

      return rfq;
    });
  }

  public static async update(id: string, data: Prisma.RFQUpdateInput): Promise<RFQ> {
    return prisma.rFQ.update({
      where: { id },
      data,
    });
  }

  public static async delete(id: string): Promise<RFQ> {
    return prisma.rFQ.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  public static async inviteVendors(rfqId: string, vendorIds: string[]): Promise<void> {
    await prisma.rFQVendor.createMany({
      data: vendorIds.map((vendorId) => ({
        rfqId,
        vendorId,
      })),
      skipDuplicates: true,
    });
  }

  public static async createAttachment(data: Prisma.RFQAttachmentUncheckedCreateInput): Promise<RFQAttachment> {
    return prisma.rFQAttachment.create({ data });
  }

  public static async list(params: {
    status?: string;
    search?: string;
    vendorId?: string;
    page: number;
    limit: number;
  }): Promise<{ rfqs: any[]; total: number }> {
    const { status, search, vendorId, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.RFQWhereInput = {
      deletedAt: null,
      ...(status ? { status: status as any } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(vendorId
        ? {
            vendors: {
              some: { vendorId },
            },
          }
        : {}),
    };

    const [rfqs, total] = await prisma.$transaction([
      prisma.rFQ.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          createdBy: {
            select: { id: true, name: true, email: true },
          },
          _count: {
            select: { vendors: true, quotations: true },
          },
        },
      }),
      prisma.rFQ.count({ where }),
    ]);

    return { rfqs, total };
  }
}

export default RFQsRepository;
