import { createCookieSessionStorage } from '@remix-run/cloudflare';
import { Authenticator } from 'remix-auth';
import type { SessionStorage } from '@remix-run/cloudflare';
import { GitHubStrategy } from 'remix-auth-github';
import { AfdianStrategy } from 'remix-auth-afdian';
import { z } from 'zod';
import type { Env } from '../env';

const UserSchema = z.object({
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
  user: UserSchema.optional(),
  strategy: z.string().optional(),
  'oauth2:state': z.string().uuid().optional(),
  'auth:error': z.object({ message: z.string() }).optional()
});

export type User = z.infer<typeof UserSchema>;

export type Session = z.infer<typeof SessionSchema>;

export interface IAuthService {
  readonly authenticator: Authenticator<User>;
  readonly sessionStorage: TypedSessionStorage<typeof SessionSchema>;
}

export class AuthService implements IAuthService {
  #sessionStorage: SessionStorage<typeof SessionSchema>;
  #authenticator: Authenticator<User>;

  constructor(env: Env, hostname: string) {
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
    this.#authenticator = new Authenticator<User>(this.#sessionStorage as unknown as SessionStorage, {
      throwOnError: true
    });

    const callbackURL = hostname.includes('localhost')
      ? `http://${hostname}:8788/auth/$provider/callback`
      : `https://${hostname}/auth/$provider/callback`;
    const afdianCallbackURL = new URL(callbackURL.replace('$provider', 'afdian'));
    const githubCallbackURL = new URL(callbackURL.replace('$provider', 'github'));

    this.#authenticator.use(
      new AfdianStrategy(
        {
          clientID: env.AFDIAN_CLIENT_ID,
          clientSecret: env.AFDIAN_CLIENT_SECRET,
          callbackURL: afdianCallbackURL.toString()
        },
        async ({ profile }) => {
          return {
            username: profile.displayName,
            ...profile
          };
        }
      )
    );

    this.#authenticator.use(
      new GitHubStrategy(
        {
          clientID: env.GITHUB_ID,
          clientSecret: env.GITHUB_SECRET,
          callbackURL: githubCallbackURL.toString()
        },
        async ({ profile }) => {
          return {
            provider: 'github',
            id: profile._json.id,
            username: profile._json.login,
            displayName: profile._json.name,
            photos: [profile._json.avatar_url],
            _json: profile._json
          };
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
