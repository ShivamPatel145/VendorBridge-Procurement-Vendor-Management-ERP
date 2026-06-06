import { z } from 'zod';

export const queryLogsSchema = z.object({
  search: z.string().optional(),
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('50'),
});
