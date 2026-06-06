import prisma from '../../config/database';
import { Prisma, Invoice, InvoiceItem, Payment } from '@prisma/client';

export class InvoicesRepository {
  public static async findById(id: string): Promise<any | null> {
    return prisma.invoice.findFirst({
      where: { id, deletedAt: null },
      include: {
        items: true,
        createdBy: { select: { id: true, name: true, email: true } },
        po: {
          include: {
            quotation: {
              include: {
                vendor: true,
              },
            },
          },
        },
        payments: true,
      },
    });
  }

  public static async create(
    invoiceData: Prisma.InvoiceUncheckedCreateInput,
    items: { description: string; quantity: number; unitPrice: number; totalPrice: number }[]
  ): Promise<Invoice> {
    return prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.create({
        data: invoiceData,
      });

      await tx.invoiceItem.createMany({
        data: items.map((item) => ({
          invoiceId: invoice.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: new Prisma.Decimal(item.unitPrice),
          totalPrice: new Prisma.Decimal(item.totalPrice),
        })),
      });

      return invoice;
    });
  }

  public static async update(id: string, data: Prisma.InvoiceUpdateInput): Promise<Invoice> {
    return prisma.invoice.update({
      where: { id },
      data,
    });
  }

  public static async list(params: {
    status?: string;
    invoiceNumber?: string;
    vendorId?: string;
    page: number;
    limit: number;
  }): Promise<{ invoices: any[]; total: number }> {
    const { status, invoiceNumber, vendorId, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.InvoiceWhereInput = {
      deletedAt: null,
      ...(status ? { status: status as any } : {}),
      ...(invoiceNumber ? { invoiceNumber: { contains: invoiceNumber, mode: 'insensitive' } } : {}),
      ...(vendorId
        ? {
            po: {
              quotation: {
                vendorId,
              },
            },
          }
        : {}),
    };

    const [invoices, total] = await prisma.$transaction([
      prisma.invoice.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          createdBy: { select: { id: true, name: true } },
          po: {
            include: {
              quotation: {
                include: {
                  vendor: true,
                },
              },
            },
          },
        },
      }),
      prisma.invoice.count({ where }),
    ]);

    return { invoices, total };
  }

  public static async getInvoiceCountThisYear(): Promise<number> {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    return prisma.invoice.count({
      where: {
        createdAt: {
          gte: startOfYear,
        },
      },
    });
  }

  public static async createPayment(params: {
    invoiceId: string;
    amount: number;
    method: string;
    reference?: string;
  }): Promise<Payment> {
    return prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          invoiceId: params.invoiceId,
          amount: new Prisma.Decimal(params.amount),
          method: params.method,
          reference: params.reference,
        },
      });

      const payments = await tx.payment.findMany({
        where: { invoiceId: params.invoiceId },
      });

      const totalPaid = payments.reduce(
        (sum, p) => sum.add(p.amount),
        new Prisma.Decimal(0)
      );

      const invoice = await tx.invoice.findUnique({
        where: { id: params.invoiceId },
      });

      if (invoice && totalPaid.gte(invoice.totalAmount)) {
        await tx.invoice.update({
          where: { id: params.invoiceId },
          data: {
            status: 'PAID',
            paidAt: new Date(),
          },
        });
      }

      return payment;
    });
  }
}

export default InvoicesRepository;
