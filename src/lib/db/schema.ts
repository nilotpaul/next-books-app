import { relations } from 'drizzle-orm';
import {
  boolean,
  mysqlTable,
  timestamp,
  varchar,
  mysqlEnum,
  int,
  json,
  decimal,
  text,
} from 'drizzle-orm/mysql-core';
import { BookGenres } from '@/types/author.types';
import { BOOK_AVAILABALITY, BOOK_LANGUAGES, BOOK_STATUS } from '../../config/constants/books';

export const users = mysqlTable('users', {
  clerkId: varchar('clerk_id', { length: 255 }).primaryKey().notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 50 }).notNull(),
  lastName: varchar('last_name', { length: 70 }).notNull(),
  username: varchar('user_name', { length: 50 }),
  imageUrl: varchar('image_url', { length: 255 }),
  strategy: varchar('strategy', { length: 50 }).notNull(),
  isAuthor: boolean('is_author').default(false),
  purchasedBooks: json('purchased_books').$type<string[]>().default([]),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').onUpdateNow().notNull(),
});

export const authors = mysqlTable('authors', {
  clerkId: varchar('clerk_id', { length: 255 }).primaryKey().notNull(),
  authorName: varchar('author_name', { length: 120 }).notNull(),
  author_image: varchar('author_image', { length: 255 }),
  bio: varchar('bio', { length: 255 }).notNull(),
  artistGenres: json('artist_genres').$type<BookGenres>().notNull(),
  confirm_email: varchar('confirmed_email', { length: 255 }).notNull(),
  isConfirmed: boolean('is_confirmed').default(false),
  secretKey: varchar('secret_key', { length: 255 }).notNull(),
  stars: int('stars').default(0),
  joinedOn: timestamp('joined_on').defaultNow().notNull(),
});

export const books = mysqlTable('books', {
  id: varchar('id', { length: 255 }).primaryKey().notNull(),
  clerkId: varchar('clerk_id', { length: 255 }).notNull(),
  bookTitle: varchar('book_name', { length: 70 }).unique().notNull(),
  content: json('content').$type<any>(),
  synopsis: text('synopsis'),
  normalised_title: varchar('normalised_title', { length: 100 }).unique().notNull(),
  frontArtwork: varchar('front_artwork', { length: 255 }),
  backArtwork: varchar('back_artwork', { length: 255 }),
  status: mysqlEnum('status', BOOK_STATUS).notNull(),
  genres: json('genres').$type<BookGenres>(),
  language: mysqlEnum('language', BOOK_LANGUAGES).notNull(),
  availability: mysqlEnum('availabality', BOOK_AVAILABALITY),
  pricing: decimal('pricing', { precision: 10, scale: 2 }),
  series: json('series').$type<string[]>().default([]).notNull(),
  collaborations: json('collaborations').$type<string[]>(),
  stars: int('stars').default(0),
  publicationDate: timestamp('publication_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').onUpdateNow().notNull(),
});

export const likes = mysqlTable('likes', {
  clerkId: varchar('clerk_id', { length: 255 }).primaryKey().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').onUpdateNow().notNull(),
});

export const socialLinks = mysqlTable('social_links', {
  clerkId: varchar('clerk_id', { length: 255 }).primaryKey().notNull(),
  instagram: varchar('instagram', { length: 255 }),
  twitter: varchar('twitter', { length: 255 }),
  other: varchar('other', { length: 255 }),
});

export const userRelations = relations(users, ({ one, many }) => ({
  author: one(authors, {
    fields: [users.clerkId],
    references: [authors.clerkId],
  }),
  likes: many(likes),
}));

export const authorRelations = relations(authors, ({ many, one }) => ({
  books: many(books),
  socialLinks: one(socialLinks, {
    fields: [authors.clerkId],
    references: [socialLinks.clerkId],
  }),
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

export const socialLinksRelations = relations(socialLinks, ({ one }) => ({
  author: one(authors, {
    fields: [socialLinks.clerkId],
    references: [authors.clerkId],
  }),
}));
