import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const views = sqliteTable('views', {
  slug: text('slug').primaryKey(),
  views: integer('views').default(0)
});
