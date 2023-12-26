import type { MiddlewareHandler } from 'hono';
import { D1Provider } from '../provider/d1.db';
import { KVProvider } from '../provider/kv.cache';
import { AppService, type IAppService } from '../services/app';
import { AuthService, type IAuthService } from '../services/auth';
import { CacheService } from '../services/cache';
import { DatabaseService } from '../services/database';
import { UserService, type IUserService } from '../services/user';

export type Bindings = {
  DB: D1Database;
  CACHE: KVNamespace;
};

declare module 'hono' {
  interface ContextVariableMap {
    app: IAppService;
    user: IUserService;
    auth: IAuthService;
  }
}

export const injectServices =
  (): MiddlewareHandler<{ Bindings: Bindings }> => async (c, next) => {
    // Init Providers
    const cacheProvider = new KVProvider(c.env.CACHE);
    const dbProvider = new D1Provider(c.env.DB);
    // Init Services
    const cache = new CacheService(cacheProvider);
    const db = new DatabaseService(dbProvider);
    // Inject Main Services
    const app = new AppService(db);
    const user = new UserService(db);
    const auth = new AuthService(user, cache);

    c.set('app', app);
    c.set('user', user);
    c.set('auth', auth);
    await next();
  };
