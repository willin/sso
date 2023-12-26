import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

const router = new Hono();

router.get(
  '/userinfo',
  zValidator(
    'header',
    z.object({
      authorization: z
        .string()
        .regex(/^bearer\s/i)
        .transform((v) => v.replace(/^bearer\s/i, ''))
    })
  ),
  async (c) => {
    const token = c.req.valid('header').authorization;
    const auth = c.get('auth');
    const user = c.get('user');

    const login = await auth.getUserFromToken(token);
    if (!login) {
      return c.json(
        {
          error: 'invalid_token'
        },
        403
      );
    }
    const u = await user.getUserById(login.id);
    const thirdparty = await user.getThirdUsersByUserId(login.id);
    return c.json({ ...u, thirdparty });
  }
);

export { router };
