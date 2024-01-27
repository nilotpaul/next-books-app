import { z } from 'zod';
import { privateProcedure, publicProcedure, router } from '../trpc';
import { getBookById, getBookInfoById, getRatedBookById } from '@/services/books.services';
import getUrl from '@/utils/getUrl';
import { TRPCError } from '@trpc/server';
import { getUserPurchases } from '@/services/user.services';
import { DrizzleError } from 'drizzle-orm';
import { stripe } from '@/lib/payments/stripeServer';
import { MAX_SEARCH_RESULTS_LIMIT } from '@/config/constants/search-filters';
import { infiniteSearchValidaion } from '@/validations';
import { getUserForumPosts } from '@/services/forumPosts.services';

export const userRouter = router({
  purchaseBook: privateProcedure
    .input(z.string().min(2, { message: 'Enter a valid id' }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const bookId = input;

      try {
        const book = await getBookById(bookId);

        if (!book || !book.id) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'No book found associated with the id',
          });
        }

        if (book.status === 'draft' || book.availability === 'Free') {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You cannot purchase this book',
          });
        }

        const billingUrl = getUrl(`/books/${book.id}`);

        const purchases = await getUserPurchases(user.id);

        if (!purchases?.userId) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Something went wrong',
          });
        }

        const { purchasedBooks } = purchases;

        if (purchasedBooks?.includes(book.id)) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'You have already purchased this book',
          });
        }

        const createStripeSession = await stripe.checkout.sessions.create({
          success_url: billingUrl,
          cancel_url: billingUrl,
          payment_method_types: ['card'],
          mode: 'payment',
          billing_address_collection: 'auto',
          line_items: [
            {
              price_data: {
                product_data: {
                  name: book.bookTitle,
                  images: [book.frontArtwork?.replace('|', '%7c')!],
                  description:
                    'Purchasing the book will grant user unlimited reading access of the book for lifetime',
                  metadata: {
                    bookId: book.id,
                  },
                },
                unit_amount: Number(book.pricing) * 100 * 82,
                currency: 'INR',
              },
              quantity: 1,
            },
          ],
          metadata: {
            userId: user.id,
            bookId: book.id,
          },
        });

        if (!createStripeSession || !createStripeSession.url) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Something went wrong during purchase',
          });
        }

        return {
          url: createStripeSession.url,
          sessionId: createStripeSession.id,
        };
      } catch (err) {
        console.error('[PURCHASE_BOOK_ERROR]:', err);

        if (err instanceof z.ZodError) {
          throw new TRPCError({
            code: 'PARSE_ERROR',
            message: 'Data passed in incorrect format',
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

  purchases: privateProcedure.input(infiniteSearchValidaion).query(async ({ ctx, input }) => {
    const { user } = ctx;
    const limit = input.limit ?? MAX_SEARCH_RESULTS_LIMIT;
    const cursor = input.cursor;

    try {
      const purchases = await getUserPurchases(user.id);

      if (!purchases || !purchases.purchasedBooks) {
        return {
          nextCursor: undefined,
          books: [],
          lastItem: null,
        };
      }

      const { purchasedBooks } = purchases;

      const startIndex = cursor ? purchasedBooks.indexOf(cursor) + 1 : 0;
      const endIndex = Math.min(startIndex + limit + 1, purchasedBooks.length);

      const newPurchasesArr = purchasedBooks.slice(startIndex, endIndex);

      const booksPromise = newPurchasesArr.map(async (bookId) => {
        const book = await getBookInfoById(bookId);
        const userBookRating = await getRatedBookById({
          bookId,
          userId: user.id,
        });
        return { book, stars: userBookRating?.stars };
      });

      const books = (await Promise.all(booksPromise)).map(({ book, stars }) => ({
        id: book?.id,
        title: book?.title,
        frontArtwork: book?.frontArtwork,
        stars,
        publishedDate: book?.publicationDate,
      }));

      let nextCursor: typeof cursor | undefined = undefined;
      let lastItem: (typeof books)[number] | null = null;

      if (books.length > limit) {
        lastItem = books.slice(-1)[0];
        const nextItem = books.pop();
        nextCursor = nextItem?.id;
      }

      return {
        books,
        nextCursor,
        lastItem,
      };
    } catch (err) {
      console.error('[PURCHASED_BOOKS_ERROR]:', err);

      if (err instanceof z.ZodError) {
        throw new TRPCError({
          code: 'PARSE_ERROR',
          message: 'Data passed in incorrect format',
        });
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get the purchases',
      });
    }
  }),

  getUserPosts: privateProcedure.input(infiniteSearchValidaion).query(async ({ ctx, input }) => {
    const { user } = ctx;
    const limit = input.limit ?? MAX_SEARCH_RESULTS_LIMIT;
    const cursor = input.cursor;

    try {
      const posts = await getUserForumPosts(user.id, limit + 1, cursor);

      if (!posts)
        return {
          nextCursor: undefined,
          posts: [],
          lastItem: null,
        };

      const newPosts = posts.map((post) => ({
        clerkId: post.userId,
        id: post.postId,
        createdAt: post.createdAt,
        image: post.postImage,
        postTitle: post.postTitle,
        content: '',
        firstName: '',
        lastName: '',
        likes: post.postLikes || [],
        tags: post.postTags || [],
      }));

      let nextCursor: typeof cursor | undefined = undefined;
      let lastItem: (typeof newPosts)[number] | null = null;

      if (newPosts.length > limit) {
        lastItem = newPosts.slice(-1)[0];
        const nextItem = newPosts.pop();
        nextCursor = nextItem?.id;
      }

      return {
        posts: newPosts,
        nextCursor,
        lastItem,
      };
    } catch (err) {
      console.error('[FORUM_POST_GET_POSTS_ERROR]:', err);

      if (err instanceof z.ZodError) {
        throw new TRPCError({
          code: 'PARSE_ERROR',
          message: 'data not passed in correct format',
        });
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get the posts',
      });
    }
  }),
});
