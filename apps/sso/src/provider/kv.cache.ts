import type { ICacheService } from '../services/cache';

export class KVProvider implements ICacheService {
  #kv: KVNamespace;

  constructor(kv: KVNamespace) {
    this.#kv = kv;
  }

  put<T>(key: string, value: T, expire?: number = 0): Promise<void> {
    return this.#kv.put(key, JSON.stringify(value), { expirationTtl: expire });
  }

  async get<T>(key: string): Promise<T | null> {
    const result = await this.#kv.get<T>(key, 'json');
    if (!result) return null;
    try {
      return JSON.parse(result) as T;
    } catch (e) {}
    return result;
  }

  delete(key: string): Promise<void> {
    return this.#kv.delete(key);
  }
}
