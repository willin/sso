import type { MiddlewareHandler } from 'hono';
import { env } from 'hono/adapter';
import { getCookie, setCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import type {
  GitHubErrorResponse,
  GitHubScope,
  GitHubTokenResponse,
  GitHubUser
} from './types';

export function githubAuth(opts: {
  client_id?: string;
  client_secret?: string;
  redirect_uri?: string;
  scope?: GitHubScope[];
  oauthApp?: boolean;
}): MiddlewareHandler<{
  Bindings: {
    GITHUB_ID: string;
    GITHUB_SECRET: string;
    GITHUB_CALLBACK_URL: string;
  };
}> {
  return async (c, next) => {
    const { GITHUB_ID, GITHUB_SECRET, GITHUB_CALLBACK_URL } = env(c);

    const options = {
      client_id: GITHUB_ID,
      client_secret: GITHUB_SECRET,
      redirect_uri: GITHUB_CALLBACK_URL,
      oauthApp: false,
      scope: ['user:email'],
      ...opts
    };

    // Avoid CSRF attack by checking state
    const queryKeys = Object.keys(c.req.queries());
    // skip check: [],['returnTo']
    if (
      queryKeys.length > 1 ||
      (queryKeys.length === 1 && !queryKeys.includes('returnTo'))
    ) {
      const storedState = getCookie(c, 'state');
      if (c.req.query('state') !== storedState) {
        throw new HTTPException(401);
      }
    }

    const returnTo = c.req.query('returnTo');
    if (returnTo) {
      setCookie(c, 'returnTo', returnTo, {
        maxAge: 60 * 10,
        httpOnly: true,
        path: '/'
        // secure: true,
      });
    }

    const code = c.req.query('code');
    // Redirect to login dialog
    if (!code) {
      const state: string =
        crypto?.randomUUID() || Math.random().toString().substring(2);
      setCookie(c, 'state', state, {
        maxAge: 60 * 10,
        httpOnly: true,
        path: '/'
        // secure: true,
      });

      const url = `https://github.com/login/oauth/authorize?${new URLSearchParams(
        {
          client_id: options.client_id,
          state,
          ...(options.oauthApp && {
            scope: options.scope.join(','),
            redirect_uri: options.redirect_uri || c.req.url
          })
        }
      ).toString()}`;
      // OAuth apps can't have multiple callback URLs, but GitHub Apps can.
      // As such, we want to make sure we call back to the same location
      // for GitHub apps and not the first configured callbackURL in the app config.
      return c.redirect(url);
    }

    async function getTokenFromCode(code: string) {
      const response = (await fetch(
        'https://github.com/login/oauth/access_token',
        {
          method: 'POST',
          body: JSON.stringify({
            client_id: options.client_id,
            client_secret: options.client_secret,
            code
          }),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        }
      ).then((res) => res.json())) as GitHubTokenResponse | GitHubErrorResponse;

      if ('error_description' in response)
        throw new HTTPException(400, { message: response.error_description });

      Object.assign(response, {
        scope: (response.scope as unknown as string).split(',') as GitHubScope[]
      });
      return response;
    }

    async function getUserData(token: string) {
      const response = (await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': '@hono-dev/auth-github'
        }
      }).then((res) => res.json())) as GitHubUser | GitHubErrorResponse;

      if ('message' in response)
        throw new HTTPException(400, { message: response.message });

      if ('id' in response) {
        return response;
      }
    }

    // Retrieve user data from github
    const token = await getTokenFromCode(code);
    const user = await getUserData(token.access_token);
    // Set return info
    c.set('github-token', token);
    c.set('github-user', user);

    await next();
  };
}
