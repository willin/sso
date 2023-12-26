import type { IDatabaseService } from '../services/database';

export class D1Provider implements IDatabaseService {
  #d1: D1Database;

  constructor(d1: D1Database) {
    this.#d1 = d1;
  }

  query<T>(sql: string, bindings?: string[] | undefined): Promise<T[]> {
    let stmt = this.#d1.prepare(sql);
    if (bindings) {
      stmt = stmt.bind(...bindings);
    }
    return stmt.all().then(({ results }) => results as T[]);
  }

  execute(sql: string, bindings?: string[] | undefined): Promise<boolean> {
    let stmt = this.#d1.prepare(sql);
    if (bindings) {
      stmt = stmt.bind(...bindings);
    }

    return stmt.run().then(({ success }) => success);
  }
}
