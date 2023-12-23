import { TRPCError, initTRPC } from '@trpc/server';
import { ZodError } from 'zod';
import superjson from 'superjson';
import { auth } from '@clerk/nextjs';

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
  const user = await auth();

  if (!user.userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  }

  return next();
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuthed);
