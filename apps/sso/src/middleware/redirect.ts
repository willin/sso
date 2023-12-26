import type { MiddlewareHandler } from 'hono';
import { getCookie, deleteCookie } from 'hono/cookie';

export const returnToRedirect = (): MiddlewareHandler => async (c, next) => {
  const returnTo = getCookie(c, 'returnTo');
  await next();
  if (returnTo && c.res.status === 307) {
    deleteCookie(c, 'returnTo', {
      httpOnly: true,
      path: '/'
    });

    c.res = new Response('', {
      headers: {
        location: returnTo
      },
      status: 307
    });
  }
};
