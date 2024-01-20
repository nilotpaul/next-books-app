import { MAX_SEARCH_RESULTS_LIMIT } from '@/config/constants/search-filters';
import { db } from '@/lib/db/conn';
import { authors, books, ratedBooks } from '@/lib/db/schema';
import { DeleteBook, RateBook, UpdateBook } from '@/types/book.types';
import { BookFilters, CreateBook } from '@/validations/bookValidation';
import { and, asc, desc, eq, gt, like, lt, or, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { cache } from 'react';

export const getRatedBookById = cache(
  async ({ userId, bookId }: { userId: string; bookId: string }) => {
    const row = await db
      .select()
      .from(ratedBooks)
      .where(and(eq(ratedBooks.clerkId, userId), eq(ratedBooks.bookId, bookId)));

    if (!row || !row[0]?.clerkId) {
      return null;
    }

    return row[0];
  }
);

export const getBookInfoById = cache(async (bookId: string) => {
  const row = await db
    .select({
      clerkId: books.clerkId,
      id: books.id,
      title: books.bookTitle,
      authorName: authors.authorName,
      synopsis: books.synopsis,
      availability: books.availability,
      collaborations: books.collaborations,
      frontArtwork: books.frontArtwork,
      backArtwork: books.backArtwork,
      genres: books.genres,
      language: books.language,
      pricing: books.pricing,
      publicationDate: books.publicationDate,
      updatedAt: books.updatedAt,
      series: books.series,
      stars: books.stars,
      ratedBy: books.ratedBy,
    })
    .from(books)
    .where(and(eq(books.id, bookId), eq(books.status, 'published')))
    .leftJoin(authors, eq(authors.clerkId, books.clerkId));

  if (!row || row.length === 0 || !row[0].authorName || !row[0].id) {
    return null;
  }

  return row[0];
});

export const getBooksByFilters = cache(
  async (
    filters: Partial<BookFilters>,
    cursor?: string,
    limit: number = MAX_SEARCH_RESULTS_LIMIT
  ) => {
    const genresQuery = filters?.genres?.map((genre) => genre).join('|');

    const row = await db
      .select({
        id: books.id,
        title: books.bookTitle,
        availability: books.availability,
        artwork: books.frontArtwork,
        price: books.pricing,
      })
      .from(books)
      .where(
        and(
          filters.genres?.length
            ? sql`books.genres REGEXP`.append(
                sql`${genresQuery}`.append(sql`COLLATE utf8mb4_general_ci`)
              )
            : undefined,
          filters.publication ? like(books.publicationDate, `%${filters.publication}%`) : undefined,
          filters.rating ? eq(books.stars, filters.rating) : undefined,
          filters.price ? like(books.pricing, `%${filters.price}%`) : undefined,
          filters.language ? like(books.language, `%${filters.language}%`) : undefined,
          filters.series ? like(books.series, `%${filters.series}%`) : undefined,
          filters.availability ? eq(books.availability, filters.availability) : undefined,
          filters.authorName ? eq(books.clerkId, filters.authorName) : undefined,
          filters.q ? like(books.bookTitle, `%${filters.q}%`) : undefined,
          cursor ? gt(books.id, cursor) : undefined
        )
      )
      .limit(limit + 1)
      .orderBy(asc(books.id));

    return row;
  }
);

export const getPublishedBooks = cache(async (limit?: number, cursor?: string) => {
  const row = await db
    .select({
      id: books.id,
      title: books.bookTitle,
      availability: books.availability,
      artwork: books.frontArtwork,
      price: books.pricing,
    })
    .from(books)
    .where(and(eq(books.status, 'published'), cursor ? lt(books.id, cursor) : undefined))
    .orderBy(desc(books.id))
    .limit(limit ?? 10);

  if (row.length === 0 || !row[0].id) {
    return null;
  }

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

export const rateBook = async (
  opts: RateBook | UpdateBook | DeleteBook
): Promise<{ success: boolean }> => {
  const rateBookTx = await db.transaction(async (tx) => {
    if (opts.action === 'Rate') {
      console.log('rate');
      const ratedBook = await tx.insert(ratedBooks).values({
        id: nanoid(),
        bookId: opts.bookId,
        bookTitle: opts.bookTitle,
        clerkId: opts.userId,
        stars: opts.stars,
      });

      if (ratedBook.rowsAffected === 0) {
        tx.rollback();
        return { success: false };
      }

      const ratedAuthorBook = await tx
        .update(books)
        .set({ stars: opts.currentBookStars + opts.stars, ratedBy: opts.prevRatedBy + 1 })
        .where(eq(books.id, opts.bookId));

      if (ratedAuthorBook.rowsAffected === 0) {
        tx.rollback();
        return { success: false };
      }

      return { success: true };
    }

    if (opts.action === 'Update') {
      console.log('update');
      const updatedRating = await db
        .update(ratedBooks)
        .set({
          stars: opts.stars,
        })
        .where(and(eq(ratedBooks.id, opts.id), eq(ratedBooks.bookId, opts.bookId)));

      if (updatedRating.rowsAffected === 0) {
        tx.rollback();
        return { success: false };
      }

      const updatedAuthorBook = await tx
        .update(books)
        .set({ stars: opts.currentBookStars + (opts.stars - opts.prevStars) })
        .where(eq(books.id, opts.bookId));

      if (updatedAuthorBook.rowsAffected === 0) {
        tx.rollback();
        return { success: false };
      }

      return { success: true };
    }
    console.log('delete');
    const deletedRating = await tx
      .delete(ratedBooks)
      .where(and(eq(ratedBooks.bookId, opts.bookId), eq(ratedBooks.id, opts.id)));

    if (deletedRating.rowsAffected === 0) {
      tx.rollback();
      return { success: false };
    }

    const updatedAuthorBook = await tx
      .update(books)
      .set({ stars: opts.currentBookStars - opts.stars, ratedBy: opts.prevRatedBy - 1 })
      .where(eq(books.id, opts.bookId));

    if (updatedAuthorBook.rowsAffected === 0) {
      tx.rollback();
      return { success: false };
    }

    return { success: true };
  });

  if (!rateBookTx.success) {
    return { success: false };
  }

  return { success: true };
};

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
