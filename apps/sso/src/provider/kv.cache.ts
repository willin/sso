import type { Context } from 'hono';
import { endTime, startTime } from 'hono/timing';
import type { ICacheService } from '../services/cache';

export class KVProvider implements ICacheService {
  #c: Context;
  #kv: KVNamespace;

  constructor(c: Context, kv: KVNamespace) {
    this.#c = c;
    this.#kv = kv;
  }

  async put<T>(key: string, value: T, expire?: number = 0): Promise<void> {
    startTime(this.#c, 'cache-put');
    await this.#kv.put(key, JSON.stringify(value), { expirationTtl: expire });
    endTime(this.#c, 'cache-put');
  }

  async get<T>(key: string): Promise<T | null> {
    startTime(this.#c, 'cache-get');
    const result = await this.#kv.get<T>(key, 'json');
    if (!result) return null;
    try {
      return JSON.parse(result) as T;
    } catch (e) {}
    endTime(this.#c, 'cache-get');
    return result;
  }

  async delete(key: string): Promise<void> {
    startTime(this.#c, 'cache-delete');
    await this.#kv.delete(key);
    endTime(this.#c, 'cache-delete');
  }
}
