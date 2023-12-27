export interface IDatabaseService {
  query<T>(sql: string, bindings?: unknown[]): Promise<T[]>;
  execute(sql: string, bindings?: unknown[]): Promise<boolean>;
}

export class DatabaseService implements IDatabaseService {
  #db: IDatabaseService;

  constructor(db: IDatabaseService) {
    this.#db = db;
  }

  query<T>(sql: string, bindings?: unknown[] | undefined): Promise<T[]> {
    return this.#db.query<T>(sql, bindings);
  }

  execute(sql: string, bindings?: unknown[] | undefined): Promise<boolean> {
    return this.#db.execute(sql, bindings);
  }
}
