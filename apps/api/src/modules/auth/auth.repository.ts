import prisma from '../../config/database';
import { Prisma, User } from '@prisma/client';

export class AuthRepository {
  public static async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  public static async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  public static async createUser(
    userData: Prisma.UserCreateInput,
    vendorData?: {
      companyName: string;
      contactPerson: string;
      phone: string;
      address: string;
    }
  ): Promise<User> {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: userData,
      });

      if (userData.role === 'VENDOR') {
        await tx.vendor.create({
          data: {
            userId: user.id,
            companyName: vendorData?.companyName || 'Unknown Company',
            contactPerson: vendorData?.contactPerson || user.name,
            phone: vendorData?.phone || '',
            address: vendorData?.address || '',
          },
        });
      }

      return user;
    });
  }

  public static async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }
}

export default AuthRepository;
