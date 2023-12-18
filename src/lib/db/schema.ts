import { mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: varchar('id', { length: 255 }).notNull().primaryKey(),
  clerkId: varchar('clerk_id', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 50 }).notNull(),
  lastName: varchar('last_name', { length: 70 }).notNull(),
  username: varchar('user_name', { length: 50 }),
  imageUrl: varchar('image_url', { length: 255 }),
  strategy: varchar('strategy', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').onUpdateNow().notNull(),
});
