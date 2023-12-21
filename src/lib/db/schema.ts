import { relations } from 'drizzle-orm';
import { boolean, mysqlTable, timestamp, varchar, mysqlEnum, int } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  clerkId: varchar('clerk_id', { length: 255 }).primaryKey().notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 50 }).notNull(),
  lastName: varchar('last_name', { length: 70 }).notNull(),
  username: varchar('user_name', { length: 50 }),
  imageUrl: varchar('image_url', { length: 255 }),
  strategy: varchar('strategy', { length: 50 }).notNull(),
  isAuthor: boolean('is_author').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').onUpdateNow().notNull(),
});

export const authors = mysqlTable('authors', {
  clerkId: varchar('clerk_id', { length: 255 }).primaryKey().notNull(),
  authorName: varchar('author_name', { length: 120 }).notNull(),
  author_image: varchar('author_image', { length: 255 }),
  stars: int('stars').default(0),
  joinedOn: timestamp('joined_on').defaultNow().notNull(),
});

export const books = mysqlTable('books', {
  id: varchar('id', { length: 255 }).primaryKey().notNull(),
  clerkId: varchar('clerk_id', { length: 255 }).notNull(),
  bookName: varchar('book_name', { length: 70 }).notNull(),
  status: mysqlEnum('status', ['draft', 'published']),
  stars: int('stars').default(0),
  publicationDate: timestamp('publication_date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').onUpdateNow().notNull(),
});

export const likes = mysqlTable('likes', {
  clerkId: varchar('clerk_id', { length: 255 }).primaryKey().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').onUpdateNow().notNull(),
});

export const userRelations = relations(users, ({ one, many }) => ({
  author: one(authors, {
    fields: [users.clerkId],
    references: [authors.clerkId],
  }),
  likes: many(likes),
}));

export const authorRelations = relations(authors, ({ many }) => ({
  books: many(books),
}));

export const booksRealtions = relations(books, ({ one }) => ({
  author: one(authors, {
    fields: [books.id],
    references: [authors.clerkId],
  }),
}));

export const likesRelations = relations(likes, ({ many }) => ({
  likedAuthors: many(authors),
  likedBooks: many(books),
}));
