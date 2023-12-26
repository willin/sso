import type { Context } from 'hono';
import { endTime, startTime } from 'hono/timing';
import type { IDatabaseService } from '../services/database';

export class D1Provider implements IDatabaseService {
  #c: Context;
  #d1: D1Database;

  constructor(c: Context, d1: D1Database) {
    this.#c = c;
    this.#d1 = d1;
  }

  async query<T>(sql: string, bindings?: string[] | undefined): Promise<T[]> {
    startTime(this.#c, 'db:query');
    let stmt = this.#d1.prepare(sql);
    if (bindings) {
      stmt = stmt.bind(...bindings);
    }
    const result = await stmt.all().then(({ results }) => results as T[]);
    endTime(this.#c, 'db:query');
    return result;
  }

  async execute(
    sql: string,
    bindings?: string[] | undefined
  ): Promise<boolean> {
    startTime(this.#c, 'db:execute');
    let stmt = this.#d1.prepare(sql);
    if (bindings) {
      stmt = stmt.bind(...bindings);
    }
    const result = await stmt.run().then(({ success }) => success);
    endTime(this.#c, 'db:execute');
    return result;
  }
}
