import { z } from 'zod';
import { nanoid } from '../utils/nanoid';
import { type ICacheService } from './cache';
import { type IUserService, type User } from './user';

const AccessTokenSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  refresh_token: z.string().optional(),
  token_type: z.string().optional().default('bearer')
});

export type AccessToken = z.infer<typeof AccessTokenSchema>;

export interface IAuthService {
  createCode(clientId: string, user: User): Promise<string>;
  deleteCode(clientId: string, code: string): Promise<void>;
  getUserFromCode(clientId: string, code: string): Promise<User | null>;
  getUserFromToken(token: string): Promise<User | null>;
  createToken(user: User): Promise<AccessToken>;
  revokeToken(token: string): Promise<void>;
}

export class AuthService implements IAuthService {
  #cache: ICacheService;
  #authCodeExpiration: number = 600;
  #authTokenExpiration: number = 86400 * 30;
  #userService: IUserService;

  constructor(userService: IUserService, cache: ICacheService) {
    this.#cache = cache;
    this.#userService = userService;
  }

  async createCode(clientId: string, user: User): Promise<string> {
    const code = nanoid(30);
    await this.#cache.put(
      `code:${clientId}:${code}`,
      JSON.stringify(user),
      this.#authCodeExpiration
    );
    return code;
  }

  getUserFromCode(clientId: string, code: string): Promise<User | null> {
    return this.#cache.get(`code:${clientId}:${code}`);
  }

  getUserFromToken(token: string): Promise<User | null> {
    return this.#cache.get(`token:${token}`);
  }

  deleteCode(clientId: string, code: string): Promise<void> {
    return this.#cache.delete(`code:${clientId}:${code}`);
  }

  async createToken(user: User): Promise<AccessToken> {
    const token = {
      access_token: nanoid(64),
      expires_in: this.#authTokenExpiration
    };
    await this.#cache.put(
      `token:${token.access_token}`,
      JSON.stringify(user),
      this.#authTokenExpiration
    );
    return AccessTokenSchema.parseAsync(token);
  }

  revokeToken(token: string): Promise<void> {
    return this.#cache.delete(`token:${token}`);
  }
}
