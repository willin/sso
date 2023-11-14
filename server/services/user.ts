import { z } from 'zod';
import { customAlphabet } from 'nanoid';
import type { Env } from '../env';
import type { ThirdUser } from './auth';
import type { IDatabaseService } from './database';

const nanoid = customAlphabet('1234567890abcdef', 10);

export enum UserType {
  Normal = 'normal',
  Admin = 'admin',
  VIP = 'vip',
  Forbidden = 'forbidden'
}

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
  getUserById(userId: string): Promise<User | null>;
  getUserByThirdUser(thirdUser: ThirdUser): Promise<User>;
  getThirdUsersByUserId(userId: string): Promise<ThirdUser[]>;
}

export class UserService implements IUserService {
  #db: IDatabaseService;

  constructor(env: Env, db: IDatabaseService) {
    this.#db = db;
  }

  #addThirdUser(userId: string, thirdUser: ThirdUser): Prmose<boolean> {
    return this.#db.execute(
      'INSERT INTO third_user (user_id, provider, third_id, username, display_name, avatar, raw) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)',
      [
        userId,
        thirdUser.provider,
        thirdUser.id,
        thirdUser.username,
        thirdUser.displayName,
        thirdUser.photos?.[0].value,
        JSON.stringify(thirdUser)
      ]
    );
  }

  async #registerUserFromThirdUser(thirdUser: ThirdUser): Promise<User> {
    const userId = nanoid();
    await this.#db.execute(
      'INSERT INTO user (id, username, display_name, avatar, type, membership) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)',
      [userId, thirdUser.username, thirdUser.displayName, thirdUser.photos?.[0].value, UserType.Normal, new Date()]
    );
    await this.#addThirdUser(userId, thirdUser);
    const user = await this.getUserById(userId);
    return user;
  }

  async getUserById(userId: string): Promise<User | null> {
    const records = await this.#db.query<User>('SELECT * FROM user WHERE id=?1 LIMIT 1', [userId]);
    if (records.length === 0) {
      return null;
    }
    return records[0];
  }

  async getUserByThirdUser(thirdUser: ThirdUser): Promise<User> {
    const record = await this.#db.query<{ user_id: string }>(
      'SELECT user_id FROM third_user WHERE provider=?1 AND third_id=?2',
      [thirdUser.provider, thirdUser.id]
    );
    if (record.length === 0) {
      // Not Registered, auto register
      const user = await this.#registerUserFromThirdUser(thirdUser);
      return user;
    }
    // Relogin
    const userId = record[0].user_id;
    const user = await this.getUserById(userId);
    return user;
  }
}
