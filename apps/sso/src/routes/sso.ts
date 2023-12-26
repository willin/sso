import { zValidator } from '@hono/zod-validator';
import { zBodyValidator } from '@hono-dev/zod-body-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import { injectServices } from '../middleware/inject';
import { safeRedirect } from '../utils/safe-redirect';

const router = new Hono();

router.use('*', injectServices());

router.get(
  '/authorize',
  zValidator(
    'query',
    z.object({
      client_id: z.string(),
      state: z.string(),
      redirect_uri: z.string(),
      lang: z.string().optional()
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
    const { client_id, state, redirect_uri, lang } = c.req.valid('query');
    const auth = c.get('auth');
    let user; // const user = await authenticator.isAuthenticated(request);

    const search = new URLSearchParams();
    // TODO: check redirect uri
    search.append('state', state);
    if (!user) {
      search.append('client_id', client_id);
      search.append('redirect_uri', redirect_uri);
      return c.redirect(`/login?${search.toString()}`);
    }
    // callback with code
    search.append('code', await auth.createCode(client_id, user));

    return c.redirect(
      safeRedirect(
        `${redirect_uri}?${search.toString()}`,
        `${lang && lang !== 'zh' ? `/${lang}` : ''}/dashboard`
      )
    );
  }
);

router.post(
  '/token',
  zBodyValidator(
    z.object({
      client_id: z.string(),
      client_secret: z.string(),
      code: z.string()
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
    const { client_id, code, client_secret } = c.req.valid('form');

    const app = c.get('app');
    const auth = c.get('auth');
    const secrets = await app.getAppSecrets(client_id);
    if (!secrets.includes(client_secret)) {
      return c.json(
        {
          error: 'invalid_client'
        },
        401
      );
    }
    const user = await auth.getUserFromCode(client_id, code);
    if (!user) {
      return c.json(
        {
          error: 'invalid_grant'
        },
        401
      );
    }
    await auth.deleteCode(client_id, code);

    const token = await auth.createToken(user);
    return c.json(token);
  }
);

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
    const app = c.get('app');
    const auth = c.get('auth');
    const secrets = await app.getAppSecrets(client_id);
    if (!secrets.includes(client_secret)) {
      return c.json(
        {
          error: 'invalid_client'
        },
        401
      );
    }
    await auth.revokeToken(token);
    return c.json({});
  }
);

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

export { router as ssoRouter };
