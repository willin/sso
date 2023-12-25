import type { MiddlewareHandler } from 'hono';

export const poweredBy = (software?: string): MiddlewareHandler => {
  return async function poweredBy(c, next) {
    await next();
    c.res.headers.set('X-Powered-By', software || 'v0');
  };
};
