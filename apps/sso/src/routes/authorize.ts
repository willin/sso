import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import { safeRedirect } from '../utils/safe-redirect';

const router = new Hono();

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

export { router };
