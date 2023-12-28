export interface ICacheService {
  put<T>(key: string, value: T, expire?: number): Promise<void>;
  get<T>(key: string): Promise<T | null>;
  delete(key: string): Promise<void>;
}

export class CacheService implements ICacheService {
  #provider: ICacheService;
  constructor(provider: ICacheService) {
    this.#provider = provider;
  }

  get<T>(key: string): Promise<T | null> {
    return this.#provider.get<T>(key);
  }

  put<T>(key: string, value: T, expire?: number | undefined): Promise<void> {
    return this.#provider.put<T>(key, value, expire);
  }

  delete(key: string): Promise<void> {
    return this.#provider.delete(key);
  }
}
