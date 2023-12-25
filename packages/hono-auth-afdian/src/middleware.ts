import type { MiddlewareHandler } from 'hono';
import { env } from 'hono/adapter';
import { getCookie, setCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import type { AfdianScope, AfdianUser } from './types';

export function afdianAuth(opts: {
  client_id?: string;
  client_secret?: string;
  redirect_uri?: string;
  scope?: AfdianScope;
}): MiddlewareHandler {
  return async (c, next) => {
    const { AFDIAN_CLIENT_ID, AFDIAN_CLIENT_SECRET, AFDIAN_CALLBACK_URL } =
      env<{
        AFDIAN_CLIENT_ID: string;
        AFDIAN_CLIENT_SECRET: string;
        AFDIAN_CALLBACK_URL: string;
      }>(c);

    const options = {
      client_id: AFDIAN_CLIENT_ID,
      client_secret: AFDIAN_CLIENT_SECRET,
      redirect_uri: AFDIAN_CALLBACK_URL,
      scope: 'basic',
      ...opts
    };

    async function getUserDataFromCode(code: string) {
      const params = new URLSearchParams();
      params.set('grant_type', 'authorization_code');
      params.set('client_id', options.client_id);
      params.set('client_secret', options.client_secret);
      params.set('code', code);
      params.set('redirect_uri', options.redirect_uri);
      const response = await fetch(
        'https://afdian.net/api/oauth2/access_token',
        {
          method: 'POST',
          body: params,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      const json = (await response.json()) as {
        ec: number;
        data: AfdianUser & { error: string };
      };

      if (json.ec !== 200)
        throw new HTTPException(400, { message: json.data.error });

      return json.data as AfdianUser;
    }

    // Avoid CSRF attack by checking state
    if (c.req.url.includes('?')) {
      const storedState = getCookie(c, 'state');
      if (c.req.query('state') !== storedState) {
        throw new HTTPException(401);
      }
    }
    const code = c.req.query('code');
    // Redirect to login dialog
    if (!code) {
      const state: string =
        crypto?.randomUUID() || Math.random().toString().substring(2);
      setCookie(c, 'state', state, {
        maxAge: 60 * 10,
        httpOnly: true,
        path: '/'
        // secure: true,
      });

      const url = `https://afdian.net/oauth2/authorize?${new URLSearchParams({
        client_id: options.client_id,
        state,
        scope: options.scope,
        redirect_uri: options.redirect_uri || c.req.url
      }).toString()}`;
      return c.redirect(url);
    }

    // Retrieve user data from fadian
    const user = await getUserDataFromCode(code);
    // Set return info
    c.set('afdian-user', user);

    await next();
  };
}
