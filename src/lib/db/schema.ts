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
  index,
} from 'drizzle-orm/mysql-core';
import { BookGenres } from '@/types/author.types';
import { BOOK_AVAILABALITY, BOOK_LANGUAGES, BOOK_STATUS } from '../../config/constants/books';

export const users = mysqlTable(
  'users',
  {
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
  },
  (table) => ({
    clerkIdx: index('clerk_idx').on(table.clerkId),
    emailIdx: index('email_idx').on(table.email),
  })
);

export const authors = mysqlTable(
  'authors',
  {
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
  },
  (table) => ({
    clerkIdx: index('clerk_idx').on(table.clerkId),
  })
);

export const books = mysqlTable(
  'books',
  {
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
    ratedBy: int('rated_by').default(0),
    purchaseCount: int('purchase_count').default(0),
    publicationDate: timestamp('publication_date'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').onUpdateNow().notNull(),
  },
  (table) => ({
    bookIdx: index('book_idx').on(table.id),
    clerkIdx: index('clerk_idx').on(table.clerkId),
    titleIdx: index('book_idx').on(table.bookTitle),
  })
);

export const ratedBooks = mysqlTable(
  'rated_books',
  {
    id: varchar('id', { length: 255 }).notNull().unique().primaryKey(),
    clerkId: varchar('clerk_id', { length: 255 }).notNull(),
    bookId: varchar('book_id', { length: 255 }).notNull(),
    bookTitle: varchar('book_name', { length: 70 }).notNull(),
    stars: int('stars').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    bookIdx: index('book_idx').on(table.id),
    clerkIdx: index('clerk_idx').on(table.clerkId),
    titleIdx: index('book_idx').on(table.bookTitle),
  })
);

export const ratedAuthors = mysqlTable(
  'rated_authors',
  {
    id: varchar('id', { length: 255 }).notNull().unique().primaryKey(),
    clerkId: varchar('clerk_id', { length: 255 }).notNull(),
    authorId: varchar('author_id', { length: 255 }).notNull(),
    authorName: varchar('author_name', { length: 70 }).notNull(),
    stars: int('stars').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    bookIdx: index('book_idx').on(table.id),
    authorIdx: index('author_idx').on(table.clerkId),
  })
);

export const socialLinks = mysqlTable(
  'social_links',
  {
    clerkId: varchar('clerk_id', { length: 255 }).primaryKey().notNull(),
    instagram: varchar('instagram', { length: 255 }),
    twitter: varchar('twitter', { length: 255 }),
    other: varchar('other', { length: 255 }),
  },
  (table) => ({ clerkIdx: index('clerk_idx').on(table.clerkId) })
);

export const forumPosts = mysqlTable(
  'forum_posts',
  {
    id: varchar('id', { length: 255 }).notNull().unique().primaryKey(),
    clerkId: varchar('clerk_id', { length: 255 }).notNull(),
    isAuthor: boolean('is_author').default(false),
    postTitle: varchar('post_title', { length: 70 }).notNull(),
    content: json('post_content').$type<any>().notNull(),
    image: varchar('post_image', { length: 255 }),
    tags: json('tags').$type<string[]>(),
    likes: json('likes').$type<string[]>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    postIdx: index('post_idx').on(table.id),
    clerkIdx: index('clerk_idx').on(table.clerkId),
    titleIdx: index('title_idx').on(table.postTitle),
  })
);

export const userRelations = relations(users, ({ one, many }) => ({
  author: one(authors, {
    fields: [users.clerkId],
    references: [authors.clerkId],
  }),
  ratedBooks: many(ratedBooks),
  ratedAuthors: many(ratedAuthors),
  forumPosts: many(forumPosts),
}));

export const authorRelations = relations(authors, ({ many, one }) => ({
  books: many(books),
  socialLinks: one(socialLinks, {
    fields: [authors.clerkId],
    references: [socialLinks.clerkId],
  }),
}));

export const booksRelations = relations(books, ({ one }) => ({
  author: one(authors, {
    fields: [books.id],
    references: [authors.clerkId],
  }),
}));

export const forumPostsRelations = relations(forumPosts, ({ one }) => ({
  user: one(users, {
    fields: [forumPosts.clerkId],
    references: [users.clerkId],
  }),
}));
