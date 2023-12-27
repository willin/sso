import { Hono } from 'hono';
import { cache } from 'hono/cache';
import { guard } from '../../middleware/guard';

const router = new Hono();

router.get(
  '/userinfo',
  guard(),
  cache({
    cacheName: 'v0-sso',
    cacheControl: 'max-age=600, stale-while-revalidate=10'
  }),
  async (c) => {
    const s = c.get('services');
    const viewer = c.get('viewer');
    const u = await s.user.getUserById(viewer.id);
    const thirdparty = await s.user.getThirdUsersByUserId(viewer.id);
    return c.json({ ...u, thirdparty });
  }
);

export { router };
