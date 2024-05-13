import { NeonDbError } from '@neondatabase/serverless';
import { TRPCError } from '@trpc/server';
import { DrizzleError } from 'drizzle-orm';
import { z } from 'zod';

export const trpcErrors = (error: unknown, genericErrorMsg: string = 'something went wrong') => {
  if (error instanceof z.ZodError) {
    throw new TRPCError({
      code: 'PARSE_ERROR',
      message: 'Data passed in incorrect format',
    });
  }
  if (error instanceof DrizzleError) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: genericErrorMsg,
    });
  }
  if (error instanceof NeonDbError) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: genericErrorMsg,
    });
  }
  if (error instanceof TRPCError) {
    throw new TRPCError({
      code: error.code,
      message: error.message,
    });
  }
  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: genericErrorMsg,
  });
};
