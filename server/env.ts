import { z } from 'zod';

export let EnvSchema = z.object({
  // BASE_URL: z.string().min(1).url(),
  CF_PAGES: z
    .literal('1')
    .optional()
    .transform(Boolean)
    .transform((isCFPages) => {
      if (isCFPages) return 'production';
      return 'development';
    }),
  COOKIE_SESSION_SECRET: z.string().min(1).optional().default('s3cret'),
  AFDIAN_CLIENT_ID: z.string().min(1),
  AFDIAN_CLIENT_SECRET: z.string().min(1),
  GITHUB_ID: z.string().min(1),
  GITHUB_SECRET: z.string().min(1),
  AUTH_CODE_EXPIRATION: z.string().optional().transform(Number).default('600'),
  AUTH_TOKEN_EXPIRATION: z.string().optional().transform(Number).default('2592000')
});

export type Env = z.infer<typeof EnvSchema>;
