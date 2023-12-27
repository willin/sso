import { zBodyValidator } from '@hono-dev/zod-body-validator';
import { Hono } from 'hono';
import { cache } from 'hono/cache';
import { z } from 'zod';
import { guard } from '../../middleware/guard';
import { URLSchema } from '../../types';

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
    console.log(apps);
    return c.json(
      viewer.type === 'admin' ? apps : apps.filter((app) => !!app.production)
    );
  }
);

router.post(
  '/apps',
  guard('admin'),
  zBodyValidator(
    z.object({
      name: z.string(),
      description: z.string().optional().default(''),
      redirect_uris: z.string().url(),
      logo: URLSchema.optional().default(''),
      homepage: URLSchema.optional().default(''),
      production: z.number().optional().default(0)
    })
  ),
  async (c) => {
    const s = c.get('services');
    const app = c.req.valid('form');
    const result = await s.app.createApp({
      ...app,
      redirect_uris: [app.redirect_uris],
      production: app.production === 1 ? 1 : 0
    });
    return c.json(result);
  }
);

router.get(
  '/apps/:id',
  guard(),
  cache({
    cacheName: 'v0-sso',
    cacheControl: 'max-age=60 0, stale-while-revalidate=10'
  }),
  async (c) => {
    const s = c.get('services');
    const id = c.req.param('id');
    const app = await s.app.getAppById(id);
    return c.json(app ? app : {});
  }
);

export { router };
