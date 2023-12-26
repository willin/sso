import { zBodyValidator } from '@hono-dev/zod-body-validator';
import { Hono } from 'hono';
import { z } from 'zod';

const router = new Hono();

router.get('/token', (c) => {
  return c.json({});
});

router.post(
  '/token',
  zBodyValidator(
    z.object({
      client_id: z.string(),
      client_secret: z.string(),
      code: z.string()
    })
  ),
  (c) => {
    // const { client_id, code, client_secret } = c.req.valid('form');
    return c.json({});
  }
);

export { router as ssoRouter };
