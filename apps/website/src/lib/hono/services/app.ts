import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';
import { formatDate } from '../utils/date';
import { nanoid } from '../utils/nanoid';
import type { IDatabaseService } from './database';

const isJsonString = (value: string) => {
  try {
    JSON.parse(value);
    return true;
  } catch (_) {
    return false;
  }
};

const SecretSchema = z.object({
  secret: z.string().optional(),
  created_at: z.string()
});

export const AppSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  logo: z.string(),
  homepage: z.string(),
  redirect_uris: z
    .string()
    .refine(isJsonString)
    .transform((value) => z.array(z.string()).parse(JSON.parse(value))),
  production: z.number().transform((value) => !!value),
  secret: z
    .string()
    .refine(isJsonString)
    .transform((value) => z.array(SecretSchema).parse(JSON.parse(value))),
  created_at: z.string(),
  updated_at: z.string()
});

export type App = z.infer<typeof AppSchema>;

export interface IAppService {
  getAppById(appId: string): Promise<App | null>;
  createApp(app: Partial<App>): Promise<App>;
  updateApp(appId: string, app: Partial<App>): Promise<App>;
  deleteApp(appId: string): Promise<boolean>;
  getAppSecrets(appId: string): Promise<string[]>;
  createSecret(appId: string): Promise<string>;
  deleteSecret(appId: string, created_at: string): Promise<boolean>;
  listApps(): Promise<App[]>;
}

export class AppService implements IAppService {
  #db: IDatabaseService;

  constructor(db: IDatabaseService) {
    this.#db = db;
  }

  async getAppById(appId: string): Promise<App | null> {
    const records = await this.#db.query<App>(
      'SELECT * FROM app WHERE id=?1 AND forbidden=0 ORDER BY created_at DESC LIMIT 1',
      [appId]
    );
    if (records.length === 0) {
      return null;
    }
    const app = AppSchema.parse(records[0]);
    app.secret.forEach((x) => delete x.secret);
    return app;
  }

  async createApp(app: Partial<App>): Promise<App> {
    const id = nanoid(20);

    await this.#db.execute(
      "INSERT INTO app (id, name, description, logo, homepage, production, redirect_uris, secret) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, '[]')",
      [
        id,
        app.name,
        app.description,
        app.logo,
        app.homepage,
        app.production,
        JSON.stringify(app.redirect_uris)
      ]
    );
    return this.getAppById(id);
  }

  async updateApp(appId: string, app: Partial<App>): Promise<App> {
    await this.#db.execute(
      'UPDATE app SET name = ?2, description = ?3, logo = ?4, homepage = ?5, redirect_uris = ?6, production = ?7, updated_at = current_timestamp WHERE id = ?1',
      [
        appId,
        app.name,
        app.description,
        app.logo,
        app.homepage,
        JSON.stringify(app.redirect_uris),
        app.production
      ]
    );
    return this.getAppById(appId);
  }

  deleteApp(appId: string): Promise<boolean> {
    return this.#db.execute(
      'UPDATE app SET fobidden = true, updated_at = current_timestamp FROM app WHERE id = ?1',
      [appId]
    );
  }

  async #getAppSecrets(appId: string) {
    const records = await this.#db.query<{ secret: string }>(
      'SELECT secret FROM app WHERE id=?1 AND forbidden=0 ORDER BY created_at DESC LIMIT 1',
      [appId]
    );
    if (records.length === 0) {
      throw new HTTPException(404, { message: 'App not found' });
    }
    return JSON.parse(records[0].secret) as (typeof SecretSchema)[];
  }

  async createSecret(appId: string): Promise<string> {
    const secret = await this.#getAppSecrets(appId);
    const key = nanoid(30);
    secret.push({
      secret: key,
      created_at: formatDate()
    });

    return this.#db
      .execute('UPDATE app SET secret = ?2 WHERE id = ?1', [
        appId,
        JSON.stringify(secret)
      ])
      .then(() => key);
  }

  async deleteSecret(appId: string, created_at: string): Promise<boolean> {
    const secret = await this.#getAppSecrets(appId);
    const index = secret.findIndex((x) => x.created_at === created_at);
    if (index === -1) return false;
    secret.splice(index, 1);

    return this.#db.execute('UPDATE app SET secret = ?2 WHERE id = ?1', [
      appId,
      JSON.stringify(secret)
    ]);
  }

  async getAppSecrets(appId: string): Promise<string[]> {
    const records = await this.#db.query<{ secret: string }>(
      'SELECT secret FROM app WHERE id=?1 AND forbidden=0 ORDER BY created_at DESC LIMIT 1',
      [appId]
    );
    if (records.length === 0) {
      return [];
    }
    const secrets = z
      .array(SecretSchema)
      .refine(isJsonString)
      .parse(JSON.parse(records[0].secret));
    return secrets.map((x) => x.secret!);
  }

  async listApps(): Promise<App[]> {
    const records = await this.#db.query<App>(
      'SELECT * FROM app WHERE forbidden=0 ORDER BY created_at DESC'
    );
    return records.map((x) => {
      const app = AppSchema.parse(x);
      app.secret.forEach((x) => delete x.secret);
      return app;
    });
  }
}
