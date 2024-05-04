import { authorProcedure, privateProcedure, publicProcedure, router } from '../trpc';
import {
  registerAuthorValidation,
  updateAuthorProfileValidation,
  verifyAuthorValidation,
} from '@/validations/authorValidations';
import {
  getAuthorById,
  getAuthorByName,
  getAuthorWithBooksById,
  getAuthorsByStars,
  registerAuthor,
  updateAuthorProfile,
  verifyAuthor,
} from '@/services/author.services';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { DrizzleError } from 'drizzle-orm';
import { emailTemplate } from '@/utils/emailTemplate';
import { nanoid } from 'nanoid';
import { AxiosError } from 'axios';
import { infiniteSearchValidaion } from '@/validations';
import { MAX_SEARCH_RESULTS_LIMIT } from '@/config/constants/search-filters';
import { omit } from 'lodash';

export const authorRouter = router({
  register: privateProcedure.input(registerAuthorValidation).mutation(async ({ input, ctx }) => {
    const { username, ...user } = ctx.user;
    const { authorName, bio, confirm_email, imageUrl, genres } = input;

    try {
      const { isAuthor, author, user: dbUser } = await getAuthorById(user.id);

      if (isAuthor) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are already an author',
        });
      }

      if (dbUser.email !== confirm_email) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid email',
        });
      }

      const verificationCode = nanoid();

      const html = emailTemplate({ username: username!, code: verificationCode });

      const status = await registerAuthor(
        {
          clerkId: user.id,
          authorName,
          bio,
          artistGenres: genres,
          secretKey: verificationCode,
          author_image: imageUrl,
          confirm_email,
        },
        {
          to: confirm_email,
          subject: 'Author Registration Verification',
          html,
          username: username!,
        }
      );

      if (!status.success) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Author registration failed',
        });
      }

      return { success: true };
    } catch (err) {
      console.error('[Error: Author_Registration]:', err);

      if (err instanceof z.ZodError) {
        throw new TRPCError({
          code: 'PARSE_ERROR',
          message: 'Data not passed in correct format',
        });
      }
      if (err instanceof DrizzleError) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to make changes to the database',
        });
      }
      if (err instanceof TRPCError) {
        throw new TRPCError({
          code: err.code,
          message: err.message,
        });
      }
      if (err instanceof AxiosError) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: err.message,
        });
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Author registration failed',
      });
    }
  }),

  verify: privateProcedure.input(verifyAuthorValidation).mutation(async ({ input, ctx }) => {
    const { id } = ctx.user;
    const { secretKey } = input;

    try {
      const { isAuthor, author } = await getAuthorById(id);

      if (isAuthor) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are already an author',
        });
      }

      if (!author?.secretKey) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No secret key found',
        });
      }

      if (author.secretKey !== secretKey) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid secret key',
        });
      }

      const { success } = await verifyAuthor(id);

      if (!success) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Author verification failed',
        });
      }

      return { success: true };
    } catch (err) {
      console.error('[Error]: Author verification', err);

      if (err instanceof z.ZodError) {
        throw new TRPCError({
          code: 'PARSE_ERROR',
          message: 'Data not passed in correct format',
        });
      }
      if (err instanceof DrizzleError) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to make changes to the database',
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
        message: 'Author verification failed',
      });
    }
  }),

  search: privateProcedure
    .input(z.string().min(2, { message: 'Author name must be greater than 2 character(s)' }))
    .query(async ({ input }) => {
      try {
        const authorArr = await getAuthorByName(input);

        if (!authorArr || authorArr.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'No artist found',
          });
        }

        return authorArr;
      } catch (err) {
        console.error('[AUTHOR_SEARCH_ERROR]', err);

        if (err instanceof z.ZodError) {
          throw new TRPCError({
            code: 'PARSE_ERROR',
            message: 'Data not passed in correct format',
          });
        }
        if (err instanceof DrizzleError) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to make changes to the database',
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

  updateProfile: authorProcedure
    .input(updateAuthorProfileValidation)
    .mutation(async ({ ctx, input }) => {
      const { author, user } = ctx;

      const { links, ...restValues } = input;
      const isEmpty = Object.values(restValues).length === 0 && Object.values(links).length === 0;

      if (isEmpty) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'At least one property is required to update',
        });
      }

      if (author.clerkId !== user.clerkId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You can only update your own profile',
        });
      }

      try {
        const { success } = await updateAuthorProfile(input, author.clerkId);

        if (!success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Something went wrong',
          });
        }

        return { success: true };
      } catch (err) {
        console.error('[AUTHOR_PROFILE_UPDATE_ERROR]:', err);

        if (err instanceof z.ZodError) {
          throw new TRPCError({
            code: 'PARSE_ERROR',
            message: 'Data not passed in correct format',
          });
        }
        if (err instanceof DrizzleError) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to make changes to the database',
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

  getAuthors: publicProcedure.input(infiniteSearchValidaion).query(async ({ input }) => {
    const limit = input.limit ?? MAX_SEARCH_RESULTS_LIMIT;
    const cursor = input.cursor;

    try {
      const authors = await getAuthorsByStars(limit + 1, cursor);

      if (!authors)
        return {
          nextCursor: undefined,
          authors: [],
          lastItem: null,
        };

      let nextCursor: typeof cursor | undefined = undefined;
      let lastItem: (typeof authors)[number] | null = null;

      if (authors.length > limit) {
        lastItem = authors.slice(-1)[0];
        const nextItem = authors.pop();
        nextCursor = nextItem?.id;
      }

      return {
        nextCursor,
        authors,
        lastItem,
      };
    } catch (err) {
      console.error('[AUTHOR_ROUTER_GET_AUTHORS_ERROR]:', err);

      if (err instanceof z.ZodError) {
        throw new TRPCError({
          code: 'PARSE_ERROR',
          message: 'data not passed in correct order',
        });
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get the authors',
      });
    }
  }),

  getAuthorBooks: authorProcedure.input(infiniteSearchValidaion).query(async ({ input, ctx }) => {
    const { user } = ctx;

    const limit = input.limit ?? MAX_SEARCH_RESULTS_LIMIT;
    const cursor = input.cursor;

    try {
      const { books } = await getAuthorWithBooksById(user.clerkId, limit + 1, cursor);
      const newbooks = books
        .map((book) => omit(book, ['normalised_title']))
        .filter((book) => Object.values(book).length > 0);

      if (!newbooks || newbooks.length === 0) {
        return {
          nextCursor: undefined,
          newbooks: [],
          lastItem: null,
        };
      }

      let nextCursor: typeof cursor | undefined = undefined;
      let lastItem: (typeof newbooks)[number] | null = null;

      if (newbooks.length > limit) {
        lastItem = newbooks.slice(-1)[0];
        const nextItem = newbooks.pop();
        nextCursor = nextItem?.id;
      }

      return {
        nextCursor,
        newbooks,
        lastItem,
      };
    } catch (err) {
      console.error('[AUTHOR_ROUTER_GET_AUTHOR_BOOKS_ERROR]:', err);

      if (err instanceof z.ZodError) {
        throw new TRPCError({
          code: 'PARSE_ERROR',
          message: 'data not passed in correct order',
        });
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get the books',
      });
    }
  }),

  getSoldBooks: authorProcedure.input(infiniteSearchValidaion).query(async ({ input, ctx }) => {
    const { author } = ctx;
    const limit = input.limit ?? MAX_SEARCH_RESULTS_LIMIT;
    const cursor = input.cursor;

    try {
      const { books } = await getAuthorWithBooksById(author.clerkId, limit + 1, cursor);

      if (!books)
        return {
          nextCursor: undefined,
          booksWithPurchaseCount: [],
          lastItem: null,
        };

      const authorBooks = books.map((book) => {
        return {
          authorImage: author.author_image,
          authorName: author.authorName,
          ...omit(book, ['normalised_title']),
        };
      });

      const booksWithPurchaseCount = authorBooks.map((book) => ({
        bookId: book.id,
        title: book.bookTitle,
        image: book.frontArtwork,
        purchaseCount: book.purchaseCount || 0,
        price: Number(book.pricing) || 0,
        status: book.status,
      }));

      let nextCursor: typeof cursor | undefined = undefined;
      let lastItem: (typeof booksWithPurchaseCount)[number] | null = null;

      if (booksWithPurchaseCount.length > limit) {
        lastItem = booksWithPurchaseCount.slice(-1)[0];
        const nextItem = booksWithPurchaseCount.pop();
        nextCursor = nextItem?.bookId;
      }

      return {
        nextCursor,
        booksWithPurchaseCount,
        lastItem,
      };
    } catch (err) {
      console.error('[AUTHOR_ROUTER_GET_SOLD_BOOKS_ERROR]:', err);

      if (err instanceof z.ZodError) {
        throw new TRPCError({
          code: 'PARSE_ERROR',
          message: 'data not passed in correct order',
        });
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get the books',
      });
    }
  }),
});
