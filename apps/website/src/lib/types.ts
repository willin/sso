import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  display_name: z.string(),
  avatar: z.string(),
  type: z.string(),
  membership: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string()
});

export type User = z.infer<typeof UserSchema>;

export const ThirdUserSchema = z.object({
  provider: z.string(),
  id: z.string(),
  username: z.string(),
  display_name: z.string(),
  photos: z
    .array(
      z.object({
        value: z.string()
      })
    )
    .optional(),
  created_at: z.string().optional(),
  _json: z.object({}).optional()
});

export type ThirdUser = z.infer<typeof ThirdUserSchema>;

export const SecretSchema = z.object({
  secret: z.string().optional(),
  created_at: z.string()
});

export const AppSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  logo: z.string(),
  homepage: z.string(),
  redirect_uris: z
    .string()
    .refine(isJsonString)
    .transform((value) => z.array(z.string()).parse(JSON.parse(value))),
  production: z.number().transform((value) => !!value),
  secret: z
    .string()
    .refine(isJsonString)
    .transform((value) => z.array(SecretSchema).parse(JSON.parse(value))),
  created_at: z.string(),
  updated_at: z.string()
});

export type App = z.infer<typeof AppSchema>;
