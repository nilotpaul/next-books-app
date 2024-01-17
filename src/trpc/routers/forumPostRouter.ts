import { forumPostValidation } from '@/validations/forumPostValidations';
import { router } from '../trpc';
import { privateProcedure } from '../trpc';
import {
  createForumPost,
  getForumPostById,
  getUserForumPostByTitle,
} from '@/services/formPosts.services';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { DrizzleError } from 'drizzle-orm';

export const forumPostRouter = router({
  create: privateProcedure.input(forumPostValidation).mutation(async ({ ctx, input }) => {
    const { user } = ctx;

    try {
      const [postByTitle, postById] = await Promise.all([
        getUserForumPostByTitle(input.postTitle, user.id),
        getForumPostById(input.id),
      ]);
      console.log({ postTitleId: postByTitle?.id, postByIdId: postById?.id });

      if (postByTitle?.id || postById?.id) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Post with the same title already exists',
        });
      }

      const { success } = await createForumPost({
        ...input,
        userId: user.id,
      });

      if (!success) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Failed to create the post',
        });
      }

      return { success: true };
    } catch (err) {
      console.error('[FORUM_POSTS_CREATE_ERROR]:', err);

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
