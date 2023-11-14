import { z } from 'zod';
import type { Env } from '../env';
import type { ThirdUser } from './auth';

const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  displayName: z.string(),
  avatar: z.string(),
  type: z.string(),
  membership: z.date().optional(),
  createdAt: z.date()
});

export type User = z.infer<typeof UserSchema>;

export interface IUserService {
  //
}

export class UserService implements IUserService {
  #db: D1Database;

  constructor(env: Env, db: D1Database) {
    this.#db = db;
  }

  async getUserByThirdUser(thirdUser: ThirdUser): Promise<User> {
    
  }
}
