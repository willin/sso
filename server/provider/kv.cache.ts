import type { ICacheService } from '../services/cache';

export class KVProvider implements ICacheService {
  #kv: KVNamespace;

  constructor(kv: KVNamespace) {
    this.#kv = kv;
  }

  put<T>(key: string, value: T, expire?: number = 0): Promise<void> {
    return this.#kv.put(key, JSON.stringify(value), { expiration: expire });
  }

  get<T>(key: string): Promise<T | null> {
    return this.#kv.get(key, 'json');
  }

  delete(key: string): Promise<void> {
    return this.#kv.delete(key);
  }
}
