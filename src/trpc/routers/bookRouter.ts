import {
  createBook,
  deleteBookById,
  getBookById,
  getBookByTitle,
  getBooksByFilters,
  publishBook,
} from '@/services/books.services';
import { isAuthor, publicProcedure, router } from '../trpc';

import {
  bookFilterValidation,
  createBookValidation,
  draftBookValidation,
  publishBookValidation,
} from '@/validations/bookValidation';
import { TRPCError } from '@trpc/server';
import { DrizzleError, like, or } from 'drizzle-orm';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { normaliseTitle } from '@/utils/utils';
import { BOOK_STATUS } from '@/config/constants/books';
import { db } from '@/lib/db/conn';
import { books } from '@/lib/db/schema';
import { MAX_SEARCH_RESULTS_LIMIT } from '@/config/constants/search-filters';

export const bookRouter = router({
  create: publicProcedure
    .use(isAuthor)
    .input(createBookValidation)
    .mutation(async ({ input, ctx }) => {
      const { author } = ctx;

      const { bookTitle, language } = input;

      try {
        const newTitle = normaliseTitle(bookTitle);
        const book = await getBookByTitle(newTitle);

        if (book?.id) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Book with the same title already exists',
          });
        }

        const bookId = nanoid();

        const { success } = await createBook({
          bookId,
          authorId: author.clerkId,
          bookTitle,
          normalised_title: newTitle,
          language,
        });

        if (!success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Something went wrong while creating the book',
          });
        }

        return { success: true, bookId };
      } catch (err) {
        console.error('[CREATE_BOOK_ERROR]:', err);

        if (err instanceof z.ZodError) {
          throw new TRPCError({
            code: 'PARSE_ERROR',
            message: 'Data not passed in correct format',
          });
        }
        if (err instanceof DrizzleError) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to make changes to the db',
          });
        }
        if (err instanceof TRPCError) {
          throw new TRPCError({
            code: err.code,
            message: err.message,
          });
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong while creating the book',
        });
      }
    }),

  publish: publicProcedure
    .use(isAuthor)
    .input(z.any())
    .mutation(async ({ input, ctx }) => {
      const { author } = ctx;

      const body = input;

      try {
        const { bookId, ...rest } = (
          body?.status === 'draft' ? draftBookValidation : publishBookValidation
        ).parse(input);

        const book = await getBookById(bookId);

        if (!book || !book?.id) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'This book does not exist',
          });
        }

        if (!(book.id === bookId && book.clerkId === author.clerkId)) {
          return new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You are not the author of this book',
          });
        }

        const { success } = await publishBook({
          id: bookId,
          clerkId: author.clerkId,
          bookTitle: rest.bookTitle,
          language: rest.language,
          status: rest.status,
          availability: rest.availability,
          backArtwork: rest.backArtwork,
          frontArtwork: rest.frontArtwork,
          collaborations: rest.collaborations,
          content: rest.content,
          genres: rest.genres,
          pricing: rest.pricing,
          normalised_title: book.normalised_title,
          series: rest.series,
          publicationDate: rest.status === 'published' ? new Date() : null,
          updatedAt: new Date(),
        });

        if (!success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to publish the book',
          });
        }
      } catch (err) {
        console.error('[PUBLISH_BOOK_ERROR]:', err);

        if (err instanceof z.ZodError) {
          throw new TRPCError({
            code: 'PARSE_ERROR',
            message: 'Data not passed in correct format',
          });
        }
        if (err instanceof DrizzleError) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to make changes to the db',
          });
        }
        if (err instanceof TRPCError) {
          throw new TRPCError({
            code: err.code,
            message: err.message,
          });
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to publish the book',
        });
      }
    }),

  delete: publicProcedure
    .use(isAuthor)
    .input(z.object({ bookId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { author } = ctx;
      const { bookId } = input;

      try {
        const book = await getBookById(bookId);

        if (!book || !book.id) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'This book does not exist',
          });
        }

        const bookAuthor = book.clerkId === author.clerkId;

        if (!bookAuthor) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You are not the author of this book',
          });
        }

        const { success } = await deleteBookById(bookId);

        if (!success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to delete the book',
          });
        }

        return { success: true };
      } catch (err) {
        console.error('[DELETE_BOOK_ERROR]:', err);

        if (err instanceof z.ZodError) {
          throw new TRPCError({
            code: 'PARSE_ERROR',
            message: 'Data not passed in correct format',
          });
        }
        if (err instanceof DrizzleError) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to make changes to the db',
          });
        }
        if (err instanceof TRPCError) {
          throw new TRPCError({
            code: err.code,
            message: err.message,
          });
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete the book',
        });
      }
    }),

  filter: publicProcedure.input(bookFilterValidation).query(async ({ input }) => {
    const { cursor } = input;
    const limit = input.limit ?? MAX_SEARCH_RESULTS_LIMIT + 1;

    try {
      const values = Object.fromEntries(
        Object.entries(input).filter(([key, value]) => {
          if (key !== ('cursor' && 'limit')) {
            return value;
          }
        })
      );

      const isEmpty = Object.values(values).length === 0;

      if (isEmpty) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Atleast one filter should be there',
        });
      }

      const books = await getBooksByFilters(values, cursor, limit);

      let nextCursor: typeof cursor | undefined = undefined;
      if (books.length > limit) {
        const nextItem = [...books].pop();
        nextCursor = nextItem?.id;
      }

      return {
        books,
        nextCursor,
      };
    } catch (err) {
      console.error('[BOOK_FILTER_ERROR]:', err);

      if (err instanceof z.ZodError) {
        throw new TRPCError({
          code: 'PARSE_ERROR',
          message: 'Data not passed in correct format',
        });
      }
      if (err instanceof DrizzleError) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to make changes to the db',
        });
      }
      if (err instanceof TRPCError) {
        throw new TRPCError({
          code: err.code,
          message: err.message,
        });
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
      });
    }
  }),
});
