export interface IDatabaseService {
  query<T>(sql: string, bindings?: string[]): Promise<T[]>;
  execute(sql: string, bindings?: string[]): Promise<boolean>;
}

export class DatabaseService implements IDatabaseService {
  #db: IDatabaseService;

  constructor(db: IDatabaseService) {
    this.#db = db;
  }

  query<T>(sql: string, bindings?: string[] | undefined): Promise<T[]> {
    return this.#db.query<T>(sql, bindings);
  }

  execute(sql: string, bindings?: string[] | undefined): Promise<boolean> {
    return this.#db.execute(sql, bindings);
  }
}
