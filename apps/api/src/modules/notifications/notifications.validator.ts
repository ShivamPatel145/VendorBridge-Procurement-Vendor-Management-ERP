import { z } from 'zod';

export const queryNotifSchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('50'),
});
