import { z } from 'zod';

export type Paginated<T> = {
  data: T[];
  total: number;
  page: number;
  size: number;
};

export const URLSchema = z.union([z.string().url().nullish(), z.literal('')]);

export const PaginationQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .refine(
      (v) => {
        const n = parseInt(v);
        return !isNaN(n) && n > 0;
      },
      {
        message: 'page must be a positive number'
      }
    )
    .transform((v) => Number(v)),
  size: z
    .string()
    .optional()
    .default('20')
    .refine(
      (v) => {
        const n = parseInt(v);
        if (!isNaN(n)) {
          return n > 0 && n <= 1000;
        }
        return false;
      },
      {
        message: 'size must be a number between 1 - 1000'
      }
    )
    .transform((v) => Number(v))
});
