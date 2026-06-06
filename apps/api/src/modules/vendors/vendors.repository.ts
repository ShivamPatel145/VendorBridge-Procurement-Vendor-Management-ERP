import prisma from '../../config/database';
import { Prisma, Vendor, VendorCategory, VendorDocument } from '@prisma/client';

export class VendorsRepository {
  public static async findById(id: string): Promise<any | null> {
    return prisma.vendor.findFirst({
      where: { id, deletedAt: null },
      include: {
        category: true,
        documents: true,
        user: {
          select: { id: true, name: true, email: true, isActive: true },
        },
      },
    });
  }

  public static async findByUserId(userId: string): Promise<Vendor | null> {
    return prisma.vendor.findFirst({
      where: { userId, deletedAt: null },
    });
  }

  public static async update(id: string, data: Prisma.VendorUpdateInput): Promise<Vendor> {
    return prisma.vendor.update({
      where: { id },
      data,
    });
  }

  public static async updateStatus(id: string, status: any): Promise<Vendor> {
    return prisma.vendor.update({
      where: { id },
      data: { status },
    });
  }

  public static async delete(id: string): Promise<Vendor> {
    return prisma.vendor.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  public static async list(params: {
    status?: string;
    categoryId?: string;
    search?: string;
    page: number;
    limit: number;
  }): Promise<{ vendors: any[]; total: number }> {
    const { status, categoryId, search, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.VendorWhereInput = {
      deletedAt: null,
      ...(status ? { status: status as any } : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(search
        ? {
            OR: [
              { companyName: { contains: search, mode: 'insensitive' } },
              { contactPerson: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [vendors, total] = await prisma.$transaction([
      prisma.vendor.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      prisma.vendor.count({ where }),
    ]);

    return { vendors, total };
  }

  // Categories
  public static async createCategory(data: Prisma.VendorCategoryCreateInput): Promise<VendorCategory> {
    return prisma.vendorCategory.create({ data });
  }

  public static async listCategories(): Promise<VendorCategory[]> {
    return prisma.vendorCategory.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  public static async getCategoryById(id: string): Promise<VendorCategory | null> {
    return prisma.vendorCategory.findFirst({
      where: { id, deletedAt: null },
    });
  }

  public static async deleteCategory(id: string): Promise<VendorCategory> {
    return prisma.vendorCategory.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // Documents
  public static async createDocument(data: Prisma.VendorDocumentUncheckedCreateInput): Promise<VendorDocument> {
    return prisma.vendorDocument.create({ data });
  }

  public static async getDocuments(vendorId: string): Promise<VendorDocument[]> {
    return prisma.vendorDocument.findMany({
      where: { vendorId },
      orderBy: { uploadedAt: 'desc' },
    });
  }
}

export default VendorsRepository;
