import { type AppLoadContext, logDevReady } from '@remix-run/cloudflare';
import { createPagesFunctionHandler } from '@remix-run/cloudflare-pages';
import * as build from '@remix-run/dev/server-build';
import { EnvSchema } from './env';
import { AuthService } from './services/auth';
import { viewsService } from './services/views';

if (process.env.NODE_ENV === 'development') {
  logDevReady(build);
}

export const onRequest = createPagesFunctionHandler({
  build,
  getLoadContext: async (ctx) => {
    const env = EnvSchema.parse(ctx.env);
    const url = new URL(ctx.request.url);
    const { hostname } = url;
    const auth = new AuthService(env, hostname);
    const views = new viewsService(ctx.env.DB as D1Database);
    await views.increment(url.pathname);
    const services: RemixServer.Services = {
      auth,
      views
    };
    return { env, services };
  },
  mode: build.mode
});
