// import { views } from '../db/schema';
// import { type DrizzleD1Database, drizzle } from 'drizzle-orm/d1';
// import { eq } from 'drizzle-orm';

export interface IviewsSerivce {
  increment(slug: string): Promise<void>;
  list(): Promise<[{ slug: string; views: number }]>;
}

// export class viewsService implements IviewsSerivce {
//   #db: DrizzleD1Database;

//   constructor(d1: D1Database) {
//     this.#db = drizzle(d1);
//   }

//   async increment(slug: string) {
//     await this.#db.transaction(async (tx) => {
//       const v = await tx.select().from(views).where(eq(views.slug, slug));
//       if (v.length === 0) {
//         await tx.insert(views).values({ slug, views: 1 });
//       } else {
//         await tx
//           .update(views)
//           .set({ views: v[0].views + 1 })
//           .where(eq(views.slug, slug));
//       }
//     });
//   }

//   async list() {
//     return await this.#db.select().from(views);
//   }
// }

export class viewsService implements IviewsSerivce {
  #db: D1Database;

  constructor(d1: D1Database) {
    this.#db = d1;
  }

  async increment(slug: string) {
    const stmt = this.#db.prepare('SELECT views FROM views WHERE slug=?').bind(slug);
    const v = await stmt.first('views');
    if (!v) {
      await this.#db.prepare('INSERT INTO views (slug, views) VALUES (?, 1)').bind(slug).run();
    } else {
      await this.#db
        .prepare('UPDATE views SET views=?2 WHERE slug=?1')
        .bind(slug, v + 1)
        .run();
    }
  }

  async list() {
    const stmt = this.#db.prepare('SELECT * FROM views');
    const { results } = await stmt.all();
    return results;
  }
}
