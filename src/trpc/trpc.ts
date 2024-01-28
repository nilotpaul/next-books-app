import { TRPCError, initTRPC } from '@trpc/server';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import type { inferAsyncReturnType } from '@trpc/server';
import { ZodError } from 'zod';
import superjson from 'superjson';
import { userSession } from '@/services/auth.services';
import { getAuthorById } from '@/services/author.services';
import { NextRequest } from 'next/server';
import { rateLimit } from '@/lib/redis';


export const createTRPCContext = async (
  opts?: Omit<FetchCreateContextFnOptions, 'req'> & { req: NextRequest }
) => {
  const user = await userSession();

  return {
    user,
    ...opts,
  };
};

export const t = initTRPC.context<TRPCContext>().create({
  errorFormatter: ({ shape, error }) => {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
  transformer: superjson,
  isDev: process.env.NODE_ENV === 'development',
});

const isAuthed = t.middleware(async ({ next }) => {
  const user = await userSession();

  if (!user || !user?.id) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  }

  return next({
    ctx: {
      user,
    },
  });
});

const withRateLimit = t.middleware(async ({ ctx, next, type }) => {
  const { req } = ctx;
  const ip = req?.ip ?? '127.0.0.1';

  try {
    const tokens = type === 'query' ? 50 : 10;
    const { success } = await rateLimit(tokens, '1 m').limit(ip);

    if (!success) {
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many requests. Please try again later',
      });
    }

    return next({
      ctx,
    });
  } catch (err) {
    if (err instanceof TRPCError) {
      throw new TRPCError({
        ...err,
      });
    }

    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
    });
  }
});

const isAuthor = t.middleware(async ({ next }) => {
  const user = await userSession();
  const { isAuthor, author, user: dbUser } = await getAuthorById(user?.id || '');

  if (!user || !user?.id || !isAuthor || !author) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You need to be an author to do this',
    });
  }

  return next({
    ctx: {
      isAuthor,
      user: dbUser,
      author,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(withRateLimit).use(isAuthed);
export const authorProcedure = t.procedure.use(withRateLimit).use(isAuthor);
export type TRPCContext = inferAsyncReturnType<typeof createTRPCContext>;
