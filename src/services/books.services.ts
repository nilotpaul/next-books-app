import { db } from '@/lib/db/conn';
import { authors, books } from '@/lib/db/schema';
import { CreateBook } from '@/validations/bookValidation';
import { and, desc, eq, like } from 'drizzle-orm';
import { cache } from 'react';

export const getPublishedBooks = cache(async () => {
  const row = await db
    .select({
      id: books.id,
      title: books.bookTitle,
      availability: books.availability,
      artwork: books.frontArtwork,
      price: books.pricing,
    })
    .from(books)
    .orderBy(desc(books.stars))
    .limit(8);

  return row;
});

export const getPublishedBookWithAuthorById = cache(async (bookId: string) => {
  const row = await db
    .select({
      authorName: authors.authorName,
      book: books,
    })
    .from(books)
    .where(
      and(eq(books.id, bookId), eq(authors.clerkId, books.clerkId), eq(books.status, 'published'))
    )
    .leftJoin(authors, eq(authors.clerkId, books.clerkId));

  if (row.length === 0 || !row[0].book.id || !row[0].authorName) {
    return null;
  }

  return row[0];
});

export const getBookById = cache(async (bookId: string) => {
  const row = await db.select().from(books).where(eq(books.id, bookId));

  if (row.length === 0 || !row[0]?.id) {
    return null;
  }

  return row[0];
});

export const getAuthorBookById = cache(
  async ({ authorId, bookId }: { bookId: string; authorId: string }) => {
    const row = await db
      .select()
      .from(books)
      .where(and(eq(books.id, bookId), eq(books.clerkId, authorId)));

    if (row.length === 0 || !row[0]?.id) {
      return null;
    }

    return row[0];
  }
);

export const getBookByTitle = cache(async (bookTitle: string) => {
  const row = await db
    .select()
    .from(books)
    .where(like(books.normalised_title, `%${bookTitle}%`));

  if (row.length === 0) {
    return null;
  }

  return row[0];
});

export const publishBook = async (payload: (typeof books)['$inferInsert']) => {
  const publish = await db.update(books).set(payload).where(eq(books.id, payload.id));

  if (publish.rowsAffected === 0) {
    return { success: false };
  }

  return { success: true };
};

export const createBook = async ({
  bookId,
  authorId,
  bookTitle,
  normalised_title,
  language,
}: CreateBook & { authorId: string; bookId: string; normalised_title: string }) => {
  // creating book as draft
  const create = await db.insert(books).values({
    clerkId: authorId,
    id: bookId,
    bookTitle,
    normalised_title,
    language,
    status: 'draft',
    updatedAt: new Date(),
  });

  console.log('create book', { create });

  if (create.rowsAffected === 0) {
    return { success: false };
  }

  return { success: true };
};

export const deleteBookById = async (bookId: string) => {
  const deletedBook = await db.delete(books).where(eq(books.id, bookId));

  if (deletedBook.rowsAffected === 0) {
    return { success: false };
  }

  return { success: true };
};
