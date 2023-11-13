import type { Env } from './env';
import type { IAuthService } from './services/auth';
import type { IviewsSerivce } from './services/views';

declare global {
  namespace RemixServer {
    export interface Services {
      auth: IAuthService;
      views: IviewsSerivce;
    }
  }
}

declare module '@remix-run/cloudflare' {
  interface AppLoadContext {
    env: Env;
    DB: D1Database;
    services: RemixServer.Services;
  }
}
