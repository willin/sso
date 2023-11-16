import type { Env } from './env';
import type { IAppService } from './services/app';
import type { IAuthService } from './services/auth';
import type { IUserService } from './services/user';

declare global {
  namespace RemixServer {
    export interface Services {
      auth: IAuthService;
      user: IUserService;
      app: IAppService;
    }
  }
}

declare module '@remix-run/cloudflare' {
  interface AppLoadContext {
    env: Env;
    services: RemixServer.Services;
  }
}
