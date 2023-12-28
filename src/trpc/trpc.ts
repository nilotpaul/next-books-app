import { TRPCError, initTRPC } from '@trpc/server';
import { ZodError } from 'zod';
import superjson from 'superjson';
import { userSession } from '@/services/auth.services';
import { getAuthorById } from '@/services/author.services';

export const t = initTRPC.create({
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

export const isAuthor = t.middleware(async ({ next }) => {
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
export const privateProcedure = t.procedure.use(isAuthed);
