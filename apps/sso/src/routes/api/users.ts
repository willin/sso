import { zValidator } from '@hono/zod-validator';
import { zBodyValidator } from '@hono-dev/zod-body-validator';
import { Hono } from 'hono';
// import { cache } from 'hono/cache';
import { z } from 'zod';
import { guard } from '../../middleware/guard';
import { PaginationQuerySchema } from '../../types';

const router = new Hono();

const UserForbiddenQuerySchema = z.object({
  forbidden: z
    .enum(['0', '1'])
    .optional()
    .default('0')
    .transform((v) => Number(v))
});

router.get(
  '/users',
  guard('admin'),
  zValidator('query', UserForbiddenQuerySchema.merge(PaginationQuerySchema)),
  // cache({
  //   cacheName: 'v0-sso',
  //   cacheControl: 'max-age=600, stale-while-revalidate=10'
  // }),
  async (c) => {
    const s = c.get('services');
    const params = c.req.valid('query');
    const users = await s.user.listUsers(params);
    return c.json(users);
  }
);

router.on(
  ['POST', 'PUT'],
  '/users/:id/forbidden',
  guard('admin'),
  zBodyValidator(
    z.object({
      forbidden: z.number().int().min(0).max(1)
    })
  ),
  // cache({
  //   cacheName: 'v0-sso',
  //   cacheControl: 'max-age=600, stale-while-revalidate=10'
  // }),
  async (c) => {
    const s = c.get('services');
    const id = c.req.param('id');
    const { forbidden } = c.req.valid('form');
    console.log(forbidden);
    const result = await s.user.changeUserForbidden(id, forbidden);
    return c.json({ result });
  }
);

export { router };
