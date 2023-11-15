import { createCookieSessionStorage } from '@remix-run/cloudflare';
import { Authenticator } from 'remix-auth';
import type { SessionStorage } from '@remix-run/cloudflare';
import { GitHubStrategy } from 'remix-auth-github';
import { AfdianStrategy } from 'remix-auth-afdian';
import { z } from 'zod';
import type { Env } from '../env';
import type { IUserService } from './user';

const ThirdUserSchema = z.object({
  provider: z.enum(['github', 'afdian']),
  id: z.string(),
  username: z.string(),
  displayName: z.string(),
  photos: z
    .array(
      z.object({
        value: z.string()
      })
    )
    .optional(),
  _json: z.object().optional()
});

const SessionSchema = z.object({
  user: ThirdUserSchema.optional(),
  strategy: z.string().optional(),
  'oauth2:state': z.string().uuid().optional(),
  'auth:error': z.object({ message: z.string() }).optional()
});

export type ThirdUser = z.infer<typeof ThirdUserSchema>;

export type Session = z.infer<typeof SessionSchema>;

export interface IAuthService {
  readonly authenticator: Authenticator<ThirdUser>;
  readonly sessionStorage: TypedSessionStorage<typeof SessionSchema>;
}

export class AuthService implements IAuthService {
  #sessionStorage: SessionStorage<typeof SessionSchema>;
  #authenticator: Authenticator<ThirdUser>;

  constructor(env: Env, url: URL, userService: IUserService) {
    let sessionStorage = createCookieSessionStorage({
      cookie: {
        name: 'sid',
        httpOnly: true,
        secure: env.CF_PAGES === 'production',
        sameSite: 'lax',
        path: '/',
        secrets: [env.COOKIE_SESSION_SECRET]
      }
    });

    this.#sessionStorage = sessionStorage;
    this.#authenticator = new Authenticator<ThirdUser>(this.#sessionStorage as unknown as SessionStorage, {
      throwOnError: true
    });

    const callbackURL = `${url.protocol}//${url.hostname}${
      ['80', '443'].includes(url.port) ? '' : `:${url.port}`
    }/auth/$provider/callback`;

    const afdianCallbackURL = callbackURL.replace('$provider', 'afdian');
    const githubCallbackURL = callbackURL.replace('$provider', 'github');

    this.#authenticator.use(
      new AfdianStrategy(
        {
          clientID: env.AFDIAN_CLIENT_ID,
          clientSecret: env.AFDIAN_CLIENT_SECRET,
          callbackURL: afdianCallbackURL
        },
        async ({ profile }) => {
          return userService.getUserByThirdUser({
            username: profile.displayName.toLowerCase(),
            ...profile
          });
        }
      )
    );

    this.#authenticator.use(
      new GitHubStrategy(
        {
          clientID: env.GITHUB_ID,
          clientSecret: env.GITHUB_SECRET,
          callbackURL: githubCallbackURL
        },
        async ({ profile }) => {
          return userService.getUserByThirdUser({
            provider: 'github',
            id: profile._json.id,
            username: profile._json.login.toLowerCase(),
            displayName: profile._json.name,
            photos: [{ value: profile._json.avatar_url }],
            _json: profile._json
          });
        }
      )
    );
  }

  get authenticator() {
    return this.#authenticator;
  }

  get sessionStorage() {
    return this.#sessionStorage;
  }
}
