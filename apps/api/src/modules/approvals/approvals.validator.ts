import { z } from 'zod';

export const startWorkflowSchema = z.object({
  quotationId: z.string().min(1, 'Quotation ID is required'),
  steps: z.array(
    z.object({
      stepNumber: z.number().int().positive(),
      approverId: z.string().min(1, 'Approver ID is required'),
      dueDate: z.string().transform((val) => new Date(val)).optional(),
    })
  ).min(1, 'At least one approval step is required'),
});

export const takeApprovalActionSchema = z.object({
  action: z.enum(['APPROVED', 'REJECTED', 'REVISION_REQUESTED']),
  comment: z.string().optional(),
});
