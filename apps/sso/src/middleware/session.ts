import type { Context, MiddlewareHandler } from 'hono';
import { endTime, startTime } from 'hono/timing';
import { type AccessToken } from '../services/auth';
import { SessionService } from '../services/session';
import { type User } from '../services/user';

declare module 'hono' {
  interface ContextVariableMap {
    session: SessionService<{
      user?: User;
      token?: AccessToken;
    }>;
  }
}

export const injectSession =
  (): MiddlewareHandler => async (c: Context<{}>, next) => {
    startTime(c, 'session:init');
    const session = new SessionService(c);
    await session.init();
    c.set('session', session);
    endTime(c, 'session:init');

    await next();

    if (session.needSync) {
      startTime(c, 'session:save');
      await session.save();
      endTime(c, 'session:save');
    }
  };
