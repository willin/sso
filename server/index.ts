import { logDevReady } from '@remix-run/cloudflare';
import { createPagesFunctionHandler } from '@remix-run/cloudflare-pages';
import * as build from '@remix-run/dev/server-build';
import { EnvSchema } from './env';
import { KVProvider } from './provider/kv.cache';
import { CacheService } from './services/cache';
import { D1Provider } from './provider/d1.db';
import { DatabaseService } from './services/database';
import { AuthService } from './services/auth';
import { UserService } from './services/user';

if (process.env.NODE_ENV === 'development') {
  logDevReady(build);
}

export const onRequest = createPagesFunctionHandler({
  build,
  getLoadContext: async (ctx) => {
    const env = EnvSchema.parse(ctx.env);
    const url = new URL(ctx.request.url);
    // Init Providers
    const cacheProvider = new KVProvider(ctx.env.SESSION);
    const dbProvider = new D1Provider(ctx.env.DB);
    // Init Services
    const cache = new CacheService(cacheProvider);
    const db = new DatabaseService(dbProvider);
    // Inject Main Services
    const user = new UserService(env, db);
    const auth = new AuthService(env, url);
    const services: RemixServer.Services = {
      auth,
      user
    };
    return { env, services };
  },
  mode: build.mode
});
