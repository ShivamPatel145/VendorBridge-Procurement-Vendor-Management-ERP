import { z } from 'zod';
import { POStatus } from '@prisma/client';

export const updatePOSchema = z.object({
  status: z.nativeEnum(POStatus).optional(),
  deliveryDate: z.string().transform((val) => new Date(val)).optional(),
  terms: z.string().optional(),
});

export const queryPOSchema = z.object({
  status: z.string().optional(),
  poNumber: z.string().optional(),
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
});
