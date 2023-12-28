import { zBodyValidator } from '@hono-dev/zod-body-validator';
import { Hono } from 'hono';
// import { cache } from 'hono/cache';
import { z } from 'zod';
import { guard } from '../../middleware/guard';
import { URLSchema } from '../../types';
import { DateTimeSchema } from '../../utils/date';

const router = new Hono();

router.get(
  '/apps',
  guard(),
  // cache({
  //   cacheName: 'v0-sso',
  //   cacheControl: 'max-age=600, stale-while-revalidate=10'
  // }),
  async (c) => {
    const s = c.get('services');
    const viewer = c.get('viewer');
    const apps = await s.app.listApps();
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
  // cache({
  //   cacheName: 'v0-sso',
  //   cacheControl: 'max-age=60 0, stale-while-revalidate=10'
  // }),
  async (c) => {
    const s = c.get('services');
    const id = c.req.param('id');
    const app = await s.app.getAppById(id);
    return c.json(app ? app : {});
  }
);

router.on(
  ['PUT', 'POST', 'PACTH'],
  '/apps/:id',
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
    const id = c.req.param('id');
    const app = c.req.valid('form');
    const result = await s.app.updateApp(id, {
      ...app,
      redirect_uris: [app.redirect_uris],
      production: app.production === 1 ? 1 : 0
    });
    return c.json(result);
  }
);

router.delete('/apps/:id', guard('admin'), async (c) => {
  const s = c.get('services');
  const id = c.req.param('id');
  const result = await s.app.deleteApp(id);
  return c.json({ result });
});

router.post('/apps/:id/secret', guard('admin'), async (c) => {
  const s = c.get('services');
  const id = c.req.param('id');
  const created = await s.app.createSecret(id);
  return c.json({ created });
});

router.delete(
  '/apps/:id/secret',
  guard('admin'),
  zBodyValidator(
    z.object({
      created_at: DateTimeSchema
    })
  ),
  async (c) => {
    const s = c.get('services');
    const id = c.req.param('id');
    const { created_at } = c.req.valid('form');
    const result = await s.app.deleteSecret(id, created_at);
    return c.json({ result });
  }
);

export { router };
