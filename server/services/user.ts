import { z } from 'zod';
import type { Env } from '../env';
import { ThirdUserSchema, type ThirdUser } from './auth';
import type { IDatabaseService } from './database';
import { nanoid } from '../utils/nanoid';

export enum UserType {
  User = 'user',
  Admin = 'admin',
  VIP = 'vip'
}

const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  displayName: z.string(),
  avatar: z.string(),
  type: z.string(),
  membership: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type User = z.infer<typeof UserSchema>;

export interface IUserService {
  getUserById(userId: string): Promise<User | null>;
  getUserByThirdUser(thirdUser: ThirdUser): Promise<User>;
  getThirdUsersByUserId(userId: string): Promise<ThirdUser[]>;
  updateUser(userId: string, user: Partial<User>): Promise<boolean>;
  bindThirdUser(userId: string, thirdUser: ThirdUser): Promise<boolean>;
  unbindThirdUser(userId: string, provider: string): Promise<boolean>;
  deleteUser(userId: string): Promise<boolean>;
  changeUserType(userId: string, userType: UserType, expire?: number | Date): Promise<boolean>;
  changeUserForbidden(userId: string, forbidden: number): Promise<boolean>;
  listUsers(args: { page?: number; size?: number; forbidden?: number }): Promise<Paginated<User>>;
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
        JSON.stringify(thirdUser._json)
      ]
    );
  }

  async #registerUserFromThirdUser(thirdUser: ThirdUser): Promise<User> {
    const userId = nanoid(10);
    try {
      await this.#db.execute(
        'INSERT INTO user (id, username, display_name, avatar, type) VALUES (?1, ?2, ?3, ?4, ?5)',
        [userId, thirdUser.username, thirdUser.displayName, thirdUser.photos?.[0].value, UserType.User]
      );
    } catch (e) {
      if (e.message.includes('user.username')) {
        await this.#db.execute(
          'INSERT INTO user (id, username, display_name, avatar, type) VALUES (?1, ?2, ?3, ?4, ?5)',
          [
            userId,
            `${thirdUser.username}-${nanoid(5)}`,
            thirdUser.displayName,
            thirdUser.photos?.[0].value,
            UserType.User
          ]
        );
      } else throw e;
    }
    await this.#addThirdUser(userId, thirdUser);
    const user = await this.getUserById(userId);
    return user;
  }

  async getUserById(userId: string): Promise<User | null> {
    const records = await this.#db.query<User>(
      'SELECT * FROM user WHERE id=?1 AND forbidden=0 ORDER BY created_at DESC LIMIT 1',
      [userId]
    );
    if (records.length === 0) {
      return null;
    }
    const [user] = records;
    return UserSchema.parse({
      ...user,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at),
      displayName: user.display_name,
      membership: user.membership ? new Date(user.membership) : null
    });
  }

  async getUserByThirdUser(thirdUser: ThirdUser): Promise<User> {
    const record = await this.#db.query<{ user_id: string }>(
      'SELECT user_id FROM third_user WHERE provider=?1 AND third_id=?2 AND forbidden=0 ORDER BY created_at DESC LIMIT 1',
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

  async listUsers(args: { page?: number; size?: number; fobidden?: number }): Promise<Paginated<User>> {
    const { page = 1, size = 20, forbidden = 0 } = args;
    const records = await this.#db.query<User>(
      'SELECT * FROM user WHERE forbidden = ?3 ORDER BY created_at DESC LIMIT ?1, ?2',
      [(page - 1) * size, size, forbidden]
    );
    const total = await this.#db.query<number>('SELECT COUNT(*) AS total FROM user WHERE forbidden = ?1', [forbidden]);
    return {
      data: records.map((user) =>
        UserSchema.parse({
          ...user,
          createdAt: new Date(user.created_at),
          updatedAt: new Date(user.updated_at),
          displayName: user.display_name,
          membership: user.membership ? new Date(user.membership) : null
        })
      ),
      total: total[0].total,
      page,
      pageSize: size
    };
  }

  changeUserForbidden(userId: string, forbidden: number): Promise<boolean> {
    return this.#db.execute('UPDATE user SET forbidden=?2 WHERE id=?1', [userId, forbidden]);
  }

  updateUser(userId: string, user: Partial<User>): Promise<boolean> {
    return this.#db.execute('UPDATE user SET username=?2, display_name=?3, avatar=?4 WHERE id=?1', [
      userId,
      user.username,
      user.displayName,
      user.avatar
    ]);
  }

  unbindThirdUser(userId: string, provider: string): Promise<boolean> {
    return this.#db.execute('DELETE FROM third_user WHERE user_id=?1 AND provider=?2 LIMIT 1', [userId, provider]);
  }

  bindThirdUser(userId: string, thirdUser: ThirdUser): Promise<boolean> {
    return this.#addThirdUser(userId, thirdUser);
  }

  async getThirdUsersByUserId(userId: string): Promise<ThirdUser[]> {
    const records = await this.#db.query<ThirdUser>(
      'SELECT * FROM third_user WHERE user_id=?1 ORDER BY created_at DESC',
      [userId]
    );
    return records.map((third) =>
      ThirdUserSchema.parse({
        ...third,
        id: third.third_id,
        displayName: third.display_name,
        photos: [{ value: third.avatar }],
        createdAt: new Date(third.created_at)
      })
    );
  }
}
