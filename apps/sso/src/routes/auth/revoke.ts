import { zBodyValidator } from '@hono-dev/zod-body-validator';
import { Hono } from 'hono';
import { z } from 'zod';

const router = new Hono();

router.post(
  '/revoke',
  zBodyValidator(
    z.object({
      client_id: z.string(),
      client_secret: z.string(),
      token: z.string()
    }),
    (result, c) => {
      if (!result.success) {
        return c.json(
          {
            error: `Validation failed: ${result.error.issues
              .map((x) => x.path)
              .join(',')}`
          },
          400
        );
      }
    }
  ),
  async (c) => {
    const { client_id, token, client_secret } = c.req.valid('form');
    const s = c.get('services');
    const secrets = await s.app.getAppSecrets(client_id);
    if (!secrets.includes(client_secret)) {
      return c.json(
        {
          error: 'invalid_client'
        },
        401
      );
    }
    await s.auth.revokeToken(token);
    return c.json({});
  }
);

export { router };
