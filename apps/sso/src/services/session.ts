import type { Context } from 'hono';
import { env } from 'hono/adapter';
import { getSignedCookie, setSignedCookie } from 'hono/cookie';

type Bindings = {
  Bindings: {
    SESSION_KEY?: string;
    SESSION_SECRET?: string;
  };
};

export class SessionService<Data = { [name: string]: unknown }> {
  #c: Context;
  #data: Map<keyof Data, any> | undefined;
  #secret: string;
  #key: string;
  #needSync: boolean = false;

  constructor(c: Context<Bindings>) {
    this.#c = c;
    const { SESSION_SECRET, SESSION_KEY } = env(c);
    this.#secret = SESSION_SECRET || 's3cr3t';
    this.#key = SESSION_KEY || '__sid';
  }

  get needSync() {
    return this.#needSync;
  }

  async init() {
    const raw = await getSignedCookie(this.#c, this.#secret, this.#key);
    if (raw) {
      this.#data = new Map(JSON.parse(raw) as unknown);
    } else {
      this.#data = new Map();
    }
  }

  get<Key extends keyof Data & string>(
    key: Key
  ): Key extends keyof Data ? Data[Key] : undefined {
    if (!this.#data) throw new Error('Not Initialized');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.#data.get(key);
  }

  set<Key extends keyof Data & string>(key: Key, value) {
    if (!this.#data) throw new Error('Not Initialized');
    this.#data.set(key, value);
    this.#needSync = true;
  }

  unset<Key extends keyof Data & string>(key: Key) {
    if (!this.#data) throw new Error('Not Initialized');
    this.#data.delete(key);
    this.#needSync = true;
  }

  destroy() {
    if (!this.#data) throw new Error('Not Initialized');
    this.#data.clear();
    this.#needSync = true;
  }

  async save() {
    if (!this.#data) throw new Error('Not Initialized');
    await setSignedCookie(
      this.#c,
      this.#key,
      JSON.stringify(this.#data.entries()),
      this.#secret,
      {
        maxAge: 86400 * 30,
        httpOnly: true,
        path: '/'
        // secure: true,
      }
    );
  }
}
