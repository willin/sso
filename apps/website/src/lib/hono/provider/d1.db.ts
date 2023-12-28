import type { Context } from 'hono';
import { setMetric } from 'hono/timing';
import type { IDatabaseService } from '../services/database';

export class D1Provider implements IDatabaseService {
  #c: Context;
  #d1: D1Database;

  constructor(c: Context, d1: D1Database) {
    this.#c = c;
    this.#d1 = d1;
  }

  async #run<T>(
    sql: string,
    bindings?: string[] | undefined
  ): Promise<D1Result<T>> {
    let stmt = this.#d1.prepare(sql);
    if (bindings) {
      stmt = stmt.bind(...bindings);
    }
    const result = await stmt.run<T>();
    setMetric(this.#c, 'db', result.meta.duration);
    return result;
  }

  async query<T>(sql: string, bindings?: string[] | undefined): Promise<T[]> {
    const result = await this.#run<T>(sql, bindings);
    return result.results;
  }

  async execute(
    sql: string,
    bindings?: string[] | undefined
  ): Promise<boolean> {
    const result = await this.#run<T>(sql, bindings);
    return result.success;
  }
}
