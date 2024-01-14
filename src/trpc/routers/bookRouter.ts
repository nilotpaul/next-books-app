import {
  createBook,
  deleteBookById,
  getBookById,
  getBookByTitle,
  getBookInfoById,
  getBooksByFilters,
  getRatedBookById,
  publishBook,
  rateBook,
} from '@/services/books.services';
import { isAuthor, privateProcedure, publicProcedure, router } from '../trpc';

import {
  bookFilterValidation,
  createBookValidation,
  draftBookValidation,
  publishBookValidation,
} from '@/validations/bookValidation';
import { TRPCError } from '@trpc/server';
import { DrizzleError } from 'drizzle-orm';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { normaliseTitle } from '@/utils/utils';
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
        ).parse(body);

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
          synopsis: rest.synopsis,
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
    const limit = input.limit ?? MAX_SEARCH_RESULTS_LIMIT;

    try {
      const filters = Object.fromEntries(
        Object.entries(input).filter(([key, value]) => {
          if (key !== ('cursor' && 'limit')) {
            return value;
          }
        })
      );

      const isEmpty = Object.values(filters).length === 0;

      if (isEmpty) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Atleast one filter should be there',
        });
      }

      const books = await getBooksByFilters(filters, cursor, limit);

      let nextCursor: typeof cursor | undefined = undefined;
      if (books.length > limit) {
        const nextItem = books[books.length - 1];
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

  rateBook: privateProcedure
    .input(
      z.object({
        bookId: z.string().min(2, {
          message: 'Invalid id',
        }),
        stars: z.coerce
          .number()
          .min(1, {
            message: 'Rating must be atleast 1',
          })
          .max(5, {
            message: 'Rating must be max of 5',
          }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { bookId, stars } = input;

      try {
        const [ratedBook, book] = await Promise.all([
          getRatedBookById({
            bookId,
            userId: user.id,
          }),
          getBookInfoById(bookId),
        ]);

        if (!book || !book?.id) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'No book found with this id',
          });
        }

        if (!ratedBook || !ratedBook.bookId) {
          const { success } = await rateBook({
            userId: user.id,
            bookId,
            bookTitle: book.title,
            stars,
            currentBookStars: book.stars ?? 0,
            prevRatedBy: book.ratedBy ?? 0,
            action: 'Rate',
          });

          if (!success) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Failed to rate the book',
            });
          }

          return { success: true, msg: 'Rated' };
        }

        if (ratedBook.bookId === bookId && ratedBook.stars === stars) {
          const { success } = await rateBook({
            bookId,
            userId: user.id,
            stars,
            currentBookStars: book.stars ?? 0,
            prevRatedBy: book.ratedBy ?? 0,
            action: 'Delete',
          });

          if (!success) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Failed to rate the book',
            });
          }

          return { success: true, msg: 'Removed Rating' };
        }

        const { success } = await rateBook({
          bookId,
          userId: user.id,
          stars,
          prevStars: ratedBook.stars,
          currentBookStars: book.stars ?? 0,
          action: 'Update',
        });

        if (!success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to rate the book',
          });
        }

        return { success: true, msg: 'Updated Rating' };
      } catch (err) {
        console.error('[BOOK_RATING_ERROR]:', err);

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
