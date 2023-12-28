import type { MiddlewareHandler } from 'hono';
import type { User } from '../services/user';

declare module 'hono' {
  interface ContextVariableMap {
    viewer: User;
  }
}

export const guard =
  (type?: string): MiddlewareHandler =>
  async (c, next) => {
    const s = c.get('services');
    const authorizationHeader = c.req.header('authorization');
    let viewer: User;
    if (authorizationHeader) {
      const token = authorizationHeader.replace(/^bearer\s/i, '');
      viewer = await s.auth.getUserFromToken(token);
    } else {
      viewer = s.session.get('user');
    }
    if (!viewer || (type && viewer.type !== type)) {
      return c.json({ error: 'invalid_token' }, 403);
    }
    c.set('viewer', viewer);
    await next();
  };
