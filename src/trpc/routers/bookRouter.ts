import { createBook, getBookByTitle } from '@/services/books.services';
import { isAuthor, publicProcedure, router } from '../trpc';

import { createBookValidation } from '@/validations/bookValidation';
import { TRPCError } from '@trpc/server';
import { DrizzleError } from 'drizzle-orm';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { normaliseTitle } from '@/utils/utils';

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
        console.error('[CREATE_BOOK_Error]:', err);

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
});
