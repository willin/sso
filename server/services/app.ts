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
  createApp(app: App): Promise<App>;
  updateApp(app: App): Promise<App>;
  deleteApp(appId: string): Promise<boolean>;
  createSecret(appId: string): Promise<string>;
  deleteSecret(appId: string, createdAt: Date): Promise<boolean>;
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
      secret: app.secret.map((x) => ({
        createdAt: new Date(x.created_at)
      })),
      createdAt: new Date(app.created_at),
      updatedAt: new Date(app.updated_at)
    });
  }

  async createApp(app: Partial<App>): Promise<App> {
    const id = nanoid(20);
    await this.#db.execute('INSERT INTO app (id, name, description, logo, homepage) VALUES (?1, ?2, ?3, ?4, ?5)', [
      id,
      app.name,
      app.description,
      app.logo,
      app.homepage,
      JSON.stringify(app.redirectUris)
    ]);
    return this.getAppById(id);
  }

  async updateApp(app: Partial<App>): Promise<App> {
    await this.#db.execute(
      'UPDATE app SET name = ?2, description = ?3, logo = ?4, homepage = ?5, redirectUris = ?6 WHERE id = ?1',
      [app.id, app.name, app.description, app.logo, app.homepage, JSON.stringify(app.redirectUris)]
    );
    return this.getAppById(app.id);
  }

  deleteApp(appId: string): Promise<boolean> {
    return this.#db.execute('UPDATE app SET fobidden = true FROM app WHERE id = ?1 LIMIT 1', [appId]);
  }

  async createSecret(appId: string): Promise<string> {
    const app = await this.getAppById(appId);
    const secret = nanoid(30);
    app.secret.push({
      secret,
      created_at: new Date()
    });

    return this.#db
      .execute('UPDATE app SET secret = ?2 WHERE id = ?1 LIMIT 1', [appId, JSON.stringify(app.secret)])
      .then(() => secret);
  }

  async deleteSecret(appId: string, createdAt: Date): Promise<boolean> {
    const app = await this.getAppById(appId);
    const index = app.secret.findIndex((x) => new Date(x.created_at).getTime() !== new Date(createdAt).getTime());
    if (index === -1) return false;
    app.secret.splice(index, 1);

    return this.#db
      .execute('UPDATE app SET secret = ?2 WHERE id = ?1 LIMIT 1', [appId, JSON.stringify(app.secret)])
      .then(() => secret);
  }
}
