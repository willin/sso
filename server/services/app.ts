import { z } from 'zod';
import type { Env } from '../env';
import type { IDatabaseService } from './database';
import { nanoid } from '../utils/nanoid';

const AppSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  logo: z.string(),
  homepage: z.string(),
  redirectUris: z.array(z.string()),
  production: z.boolean().transform(Boolean),
  secret: z.array(
    z.object({
      createdAt: z.date()
    })
  ),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type App = z.infer<typeof AppSchema>;

export interface IAppService {
  getAppById(appId: string): Promise<App | null>;
  createApp(app: Partial<App>): Promise<App>;
  updateApp(appId: string, app: Partial<App>): Promise<App>;
  deleteApp(appId: string): Promise<boolean>;
  getAppSecrets(appId: string): Promise<string[]>;
  createSecret(appId: string): Promise<string>;
  deleteSecret(appId: string, createdAt: Date): Promise<boolean>;
  listApps(): Promise<App[]>;
}

export class AppService implements IAppService {
  #db: IDatabaseService;

  constructor(env: Env, db: IDatabaseService) {
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
    const app = records[0];
    return AppSchema.parse({
      ...app,
      redirectUris: JSON.parse(app.redirect_uris),
      production: !!app.production,
      secret: JSON.parse(app.secret).map((x) => ({
        createdAt: new Date(x.created_at)
      })),
      createdAt: new Date(app.created_at),
      updatedAt: new Date(app.updated_at)
    });
  }

  async createApp(app: Partial<App>): Promise<App> {
    const id = nanoid(20);
    await this.#db.execute(
      "INSERT INTO app (id, name, description, logo, homepage, production, redirect_uris, secret) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, '[]')",
      [id, app.name, app.description, app.logo, app.homepage, app.production, JSON.stringify(app.redirectUris)]
    );
    return this.getAppById(id);
  }

  async updateApp(appId: string, app: Partial<App>): Promise<App> {
    await this.#db.execute(
      'UPDATE app SET name = ?2, description = ?3, logo = ?4, homepage = ?5, redirect_uris = ?6, production = ?7, updated_at = current_timestamp WHERE id = ?1',
      [appId, app.name, app.description, app.logo, app.homepage, JSON.stringify(app.redirectUris), app.production]
    );
    return this.getAppById(appId);
  }

  deleteApp(appId: string): Promise<boolean> {
    return this.#db.execute('UPDATE app SET fobidden = true, updated_at = current_timestamp FROM app WHERE id = ?1', [
      appId
    ]);
  }

  async #getAppSecrets(appId: string) {
    const records = await this.#db.query<App>(
      'SELECT secret FROM app WHERE id=?1 AND forbidden=0 ORDER BY created_at DESC LIMIT 1',
      [appId]
    );
    if (records.length === 0) {
      throw new Error('App not found');
    }
    const secret = JSON.parse(records[0].secret);
    return secret.map((x) => ({
      secret: x.secret,
      created_at: new Date(x.created_at)
    }));
  }

  async createSecret(appId: string): Promise<string> {
    const secret = await this.#getAppSecrets(appId);
    const key = nanoid(30);
    secret.push({
      secret: key,
      created_at: Date.now()
    });

    return this.#db
      .execute('UPDATE app SET secret = ?2 WHERE id = ?1', [appId, JSON.stringify(secret)])
      .then(() => key);
  }

  async deleteSecret(appId: string, createdAt: Date): Promise<boolean> {
    const secret = await this.#getAppSecrets(appId);
    const index = secret.findIndex((x) => new Date(x.created_at).getTime() === new Date(createdAt).getTime());
    if (index === -1) return false;
    secret.splice(index, 1);

    return this.#db.execute('UPDATE app SET secret = ?2 WHERE id = ?1', [appId, JSON.stringify(secret)]);
  }

  async getAppSecrets(appId: string): Promise<string[]> {
    const records = await this.#db.query(
      'SELECT secret FROM app WHERE id=?1 AND forbidden=0 ORDER BY created_at DESC LIMIT 1',
      [appId]
    );
    if (records.length === 0) {
      return [];
    }
    const { secret } = records[0];
    try {
      const data = JSON.parse(secret);
      return data.map((x) => x.secret);
    } catch (e) {}
    return [];
  }

  async listApps(): Promise<App[]> {
    const records = await this.#db.query<App>('SELECT * FROM app WHERE forbidden=0 ORDER BY created_at DESC');
    return records.map((app) =>
      AppSchema.parse({
        ...app,
        redirectUris: JSON.parse(app.redirect_uris),
        production: !!app.production,
        secret: JSON.parse(app.secret).map((x) => ({
          createdAt: new Date(x.created_at)
        })),
        createdAt: new Date(app.created_at),
        updatedAt: new Date(app.updated_at)
      })
    );
  }
}
