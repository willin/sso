import { Hono } from 'hono';
import { cache } from 'hono/cache';
import { guard } from '../../middleware/guard';

const router = new Hono();

router.get(
  '/apps',
  guard(),
  cache({
    cacheName: 'v0-sso',
    cacheControl: 'max-age=600, stale-while-revalidate=10'
  }),
  async (c) => {
    const s = c.get('services');
    const viewer = c.get('viewer');
    const apps = await s.app.listApps();
    return c.json(
      viewer.type === 'admin' ? apps : apps.filter((app) => !!app.production)
    );
  }
);

export { router };
