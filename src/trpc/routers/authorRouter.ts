import { privateProcedure, router } from '../trpc';

import { registerAuthorValidation, verifyAuthorValidation } from '@/validations/authorValidations';
import { getAuthorById, registerAuthor, verifyAuthor } from '@/services/author.services';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { DrizzleError } from 'drizzle-orm';
import { emailTemplate } from '@/utils/emailTemplate';
import { nanoid } from 'nanoid';
import { AxiosError } from 'axios';

export const authorRouter = router({
  register: privateProcedure.input(registerAuthorValidation).mutation(async ({ input, ctx }) => {
    const { username, ...user } = ctx.user;
    const { authorName, bio, confirm_email, imageUrl, genres } = input;

    try {
      const author = await getAuthorById(user.id);

      if (author.isAuthor) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are already an author',
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
});
