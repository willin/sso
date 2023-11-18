import type { Env } from '../env';
import github from './github.third';
import afdian from './afdian.third';
import { AvailableProviders } from '~/config';
import type { IUserService } from '../services/user';

export interface IBindThirdPartyProvider {
  bindThirdPartyRedirect(provider: string): string;
  bindThirdPartyCallback(
    userId: string,
    provider: string,
    request: Request,
    userService: IUserService
  ): Promise<boolean>;
}

const ProviderClass = { github, afdian };

export class BindThirdPartyProvider implements IBindThirdPartyProvider {
  #providers: Record<string, IBindThirdPartyProvider>;
  constructor(env: Env, url: URL) {
    this.#providers = {} as Record<string, IBindThirdPartyProvider>;
    AvailableProviders.forEach((provider) => {
      this.#providers[provider] = new ProviderClass[provider](env, url);
    });
  }

  bindThirdPartyRedirect(provider: string): string {
    return this.#providers[provider].bindThirdPartyRedirect(provider);
  }

  bindThirdPartyCallback(userId: string, provider: string, request: Request, userService): Promise<boolean> {
    return this.#providers[provider].bindThirdPartyCallback(userId, provider, request, userService);
  }
}
