import type { MiddlewareHandler } from 'hono';
import { D1Provider } from '../provider/d1.db';
import { KVProvider } from '../provider/kv.cache';
import { AppService, type IAppService } from '../services/app';
import { AuthService, type IAuthService } from '../services/auth';
import { CacheService } from '../services/cache';
import { DatabaseService } from '../services/database';
import { SessionService } from '../services/session';
import { UserService, type IUserService, type User } from '../services/user';

export type Bindings = {
  DB: D1Database;
  CACHE: KVNamespace;
};

declare module 'hono' {
  interface ContextVariableMap {
    services: {
      app: IAppService;
      user: IUserService;
      auth: IAuthService;
      session: SessionService<{
        user?: User;
      }>;
    };
  }
}

export const injectServices =
  (): MiddlewareHandler<{ Bindings: Bindings }> => async (c, next) => {
    // Init Providers
    const cacheProvider = new KVProvider(c, c.env.CACHE);
    const dbProvider = new D1Provider(c, c.env.DB);
    // Init Services
    const cache = new CacheService(cacheProvider);
    const db = new DatabaseService(dbProvider);
    // Inject Main Services
    const app = new AppService(db);
    const user = new UserService(db);
    const auth = new AuthService(user, cache);
    const session = new SessionService(c);
    await session.init();

    c.set('services', {
      app,
      user,
      auth,
      session
    });

    await next();

    if (session.needSync) {
      await session.save();
    }
  };
