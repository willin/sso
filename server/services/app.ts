import { z } from 'zod';
import type { Env } from '../env';
import type { IDatabaseService } from './database';

const AppSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  logo: z.string(),
  createdAt: z.date()
});

export type App = z.infer<typeof AppSchema>;

export interface IAppService {
  getAppById(appId: string): Promise<App | null>;
  createApp(app: App): Promise<App>;
  updateApp(app: App): Promise<App>;
  deleteApp(appId: string): Promise<boolean>;
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
    return AppSchema.parse(records[0]);
  }

  // async createApp(app: App): Promise<App> {
  //   await this.#db.execute('INSERT INTO app (id, name, description) VALUES (?1, ?2, ?3)', [
  //     app.id,
  //     app.name,
  //     app.description
  //   ]);
  //   return this.getAppById(app.id);
  // }

  // async updateApp(app: App): Promise<App> {
  //   await this.#db.execute('UPDATE app SET name = ?2, description = ?3 WHERE id = ?1', [
  //     app.id,
  //     app.name,
  //     app.description
  //   ]);
  //   return this.getAppById(app.id);
  // }

  // async deleteApp(appId: string): Promise<boolean> {
  //   const result = await this.#db.execute('DELETE FROM app WHERE id = ?1', [appId]);
  //   return result.affectedRows > 0;
  // }
}
