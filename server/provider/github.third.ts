import type { Env } from '../env';
import type { IUserService } from '../services/user';
import type { IBindThirdPartyProvider } from './thirdparty';

export default class BindGithubProvider implements IBindThirdPartyProvider {
  #clientId: string;
  #clientSecret: string;
  #callbackUrl: string;
  #authorizeUrl: string = 'https://github.com/login/oauth/authorize';
  #tokenUrl: string = 'https://github.com/login/oauth/access_token';
  #userInfoUrl: string = 'https://api.github.com/user';
  #scope: string = 'user:email';

  constructor(env: Env, url: URL) {
    const callbackURL = `${url.protocol}//${url.hostname}${
      ['80', '443'].includes(url.port) ? '' : `:${url.port}`
    }/auth/$provider/callback`;

    this.#clientId = env.GITHUB_ID;
    this.#clientSecret = env.GITHUB_SECRET;
    this.#callbackUrl = callbackURL.replace('$provider', 'github');
  }

  bindThirdPartyRedirect(provider: string): string {
    const params = new URLSearchParams();
    params.set('response_type', 'code');
    params.set('client_id', this.#clientId);
    params.set('redirect_uri', this.#callbackUrl);
    params.set('state', Date.now());
    params.set('scope', this.#scope);
    const url = new URL(this.#authorizeUrl);
    url.search = params.toString();
    return url.toString();
  }

  async bindThirdPartyCallback(
    userId: string,
    provider: string,
    request: Request,
    userService: IUserService
  ): Promise<boolean> {
    const url = new URL(request.url);
    const params = new URLSearchParams(url.searchParams);
    params.set('grant_type', 'authorization_code');
    params.set('redirect_uri', this.#callbackUrl);
    const headers: HeadersInit = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    params.set('client_id', this.#clientId);
    params.set('client_secret', this.#clientSecret);
    const response = await fetch(this.#tokenUrl, {
      method: 'POST',
      headers,
      body: params
    });
    const data = new URLSearchParams(await response.text());
    const accessToken = data.get('access_token');
    const profile = await this.#userProfile(accessToken);
    return userService.bindThirdUser(userId, profile);
  }

  async #userProfile(accessToken: string): Promise<Record<string, unkown>> {
    console.log(accessToken);
    const response = await fetch(this.#userInfoUrl, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${accessToken}`,
        'User-Agent': 'Remix-Auth'
      }
    });

    const data = await response.json();

    return {
      provider: 'github',
      id: data.id,
      username: data.login.toLowerCase(),
      displayName: data.name,
      photos: [{ value: data.avatar_url }],
      _json: data
    };
  }
}
