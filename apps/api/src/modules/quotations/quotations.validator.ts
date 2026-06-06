import { z } from 'zod';
import { QuotationStatus } from '@prisma/client';

export const createQuotationSchema = z.object({
  rfqId: z.string().min(1, 'RFQ ID is required'),
  notes: z.string().optional(),
  validUntil: z.string().transform((val) => new Date(val)).optional(),
  items: z.array(
    z.object({
      rfqItemId: z.string().optional(),
      description: z.string().min(1, 'Description is required'),
      quantity: z.number().int().positive('Quantity must be positive'),
      unitPrice: z.number().positive('Unit price must be positive'),
    })
  ).min(1, 'At least one quotation item is required'),
});

export const updateQuotationSchema = z.object({
  notes: z.string().optional(),
  validUntil: z.string().transform((val) => new Date(val)).optional(),
  status: z.nativeEnum(QuotationStatus).optional(),
  items: z.array(
    z.object({
      id: z.string().optional(),
      rfqItemId: z.string().optional(),
      description: z.string().min(1).optional(),
      quantity: z.number().int().positive().optional(),
      unitPrice: z.number().positive().optional(),
    })
  ).optional(),
});

export const queryQuotationSchema = z.object({
  rfqId: z.string().optional(),
  vendorId: z.string().optional(),
  status: z.string().optional(),
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
});
