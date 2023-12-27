import { z } from 'zod';

export type Paginated<T> = {
  data: T[];
  total: number;
  page: number;
  size: number;
};

export const URLSchema = z.union([z.string().url().nullish(), z.literal('')]);
