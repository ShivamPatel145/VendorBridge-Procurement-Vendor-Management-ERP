import { z } from 'zod';
import { RFQStatus } from '@prisma/client';

export const createRFQSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  deadline: z.string().transform((val) => new Date(val)),
  items: z.array(
    z.object({
      description: z.string().min(1, 'Item description is required'),
      quantity: z.number().int().positive('Quantity must be positive'),
      unit: z.string().min(1, 'Unit is required'),
    })
  ).min(1, 'At least one RFQ item is required'),
});

export const updateRFQSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  deadline: z.string().transform((val) => new Date(val)).optional(),
  status: z.nativeEnum(RFQStatus).optional(),
});

export const inviteVendorsSchema = z.object({
  vendorIds: z.array(z.string()).min(1, 'Select at least one vendor'),
});

export const queryRFQSchema = z.object({
  status: z.string().optional(),
  search: z.string().optional(),
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
});
