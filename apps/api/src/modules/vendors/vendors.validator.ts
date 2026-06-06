import { z } from 'zod';
import { VendorStatus } from '@prisma/client';

export const updateVendorSchema = z.object({
  companyName: z.string().min(2).optional(),
  contactPerson: z.string().min(2).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  taxId: z.string().optional(),
  website: z.string().optional(),
  categoryId: z.string().optional(),
});

export const updateVendorStatusSchema = z.object({
  status: z.nativeEnum(VendorStatus),
});

export const categorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});

export const queryVendorSchema = z.object({
  status: z.string().optional(),
  categoryId: z.string().optional(),
  search: z.string().optional(),
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
});
