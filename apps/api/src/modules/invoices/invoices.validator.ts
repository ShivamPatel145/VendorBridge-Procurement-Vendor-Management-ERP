import { z } from 'zod';
import { InvoiceStatus } from '@prisma/client';

export const createInvoiceSchema = z.object({
  poId: z.string().min(1, 'PO ID is required'),
  dueDate: z.string().transform((val) => new Date(val)),
});

export const updateInvoiceSchema = z.object({
  status: z.nativeEnum(InvoiceStatus).optional(),
  dueDate: z.string().transform((val) => new Date(val)).optional(),
});

export const recordPaymentSchema = z.object({
  amount: z.number().positive('Payment amount must be positive'),
  method: z.string().min(1, 'Payment method is required'),
  reference: z.string().optional(),
});

export const queryInvoiceSchema = z.object({
  status: z.string().optional(),
  invoiceNumber: z.string().optional(),
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
});
