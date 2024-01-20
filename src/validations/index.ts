import { z } from 'zod';

export const infiniteSearchValidaion = z.object({
  limit: z.number().optional(),
  cursor: z.string().optional(),
});

export type InfiniteSearch = z.infer<typeof infiniteSearchValidaion>;
