import { db } from '@/lib/db/conn';
import { books } from '@/lib/db/schema';
import { normaliseTitle } from '@/utils/utils';
import { CreateBook } from '@/validations/bookValidation';
import { and, eq, like } from 'drizzle-orm';
import { cache } from 'react';

export const getAuthorBookById = cache(
  async ({ authorId, bookId }: { bookId: string; authorId: string }) => {
    const row = await db
      .select()
      .from(books)
      .where(and(eq(books.id, bookId), eq(books.clerkId, authorId)));

    if (!row[0]?.id) {
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
