import type { Env } from '../env';
import type { IBindThirdPartyProvider } from './thirdparty';

export default class BindAfdianProvider implements IBindThirdPartyProvider {
  #clientId: string;
  #clientSecret: string;
  #callbackUrl: string;
  #authorizeUrl: string = 'https://afdian.net/oauth2/authorize';
  #tokenUrl: string = 'https://afdian.net/api/oauth2/access_token';

  #scope: string = 'basic';

  constructor(env: Env, url: URL) {
    const callbackURL = `${url.protocol}//${url.hostname}${
      ['80', '443', ''].includes(url.port) ? '' : `:${url.port}`
    }/auth/$provider/callback`;

    this.#clientId = env.AFDIAN_CLIENT_ID;
    this.#clientSecret = env.AFDIAN_CLIENT_SECRET;
    this.#callbackUrl = callbackURL.replace('$provider', 'afdian');
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
    const json = await response.json();

    return userService.bindThirdUser(userId, {
      provider: 'afdian',
      id: json.data.user_id,
      username: json.data.name.toLowerCase(),
      displayName: json.data.name,
      photos: [{ value: json.data.avatar }],
      _json: json.data
    });
  }
}
