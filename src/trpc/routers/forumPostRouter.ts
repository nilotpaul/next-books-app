import { forumPostValidation } from '@/validations/forumPostValidations';
import { publicProcedure, router } from '../trpc';
import { privateProcedure } from '../trpc';
import {
  createForumPost,
  deleteForumPost,
  getForumPostById,
  getForumPosts,
  getUserForumPostByTitle,
  likeForumPost,
} from '@/services/forumPosts.services';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { DrizzleError } from 'drizzle-orm';
import { MAX_SEARCH_RESULTS_LIMIT } from '@/config/constants/search-filters';
import { infiniteSearchValidaion } from '@/validations';
import { trpcErrors } from '@/lib/errors/trpcErrors';

export const forumPostRouter = router({
  create: privateProcedure.input(forumPostValidation).mutation(async ({ ctx, input }) => {
    const { user } = ctx;

    try {
      const [postByTitle, postById] = await Promise.all([
        getUserForumPostByTitle(input.postTitle, user.id),
        getForumPostById(input.id),
      ]);

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

      return trpcErrors(err);
    }
  }),

  delete: privateProcedure
    .input(z.object({ postId: z.string().min(2, { message: 'Enter a valid id' }) }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { postId } = input;

      try {
        const post = await getForumPostById(postId);

        if (!post) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'No post found by this id',
          });
        }

        if (post.clerkId !== user.id) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'No cannot delete this post',
          });
        }

        const { success } = await deleteForumPost(post.id, user.id);

        if (!success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to delete the post',
          });
        }

        return { success: true };
      } catch (err) {
        console.error('[FORUM_POST_DELETE_ERROR]:', err);

        return trpcErrors(err);
      }
    }),

  like: privateProcedure
    .input(
      z.object({
        postId: z.string().min(2, { message: 'Enter a valid id' }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { postId } = input;

      try {
        const post = await getForumPostById(postId);

        if (!post || !post.id) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Post not found',
          });
        }

        if (!post.likes?.includes(user.id)) {
          const { success } = await likeForumPost({
            action: 'Like',
            userId: user.id,
            postId: post.id,
            prevTotalLikes: post.likes || [],
          });

          if (!success) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Failed to like the post',
            });
          }

          return { success: true, msg: 'Liked Post' };
        }

        const { success } = await likeForumPost({
          action: 'Delete',
          postId: post.id,
          userId: user.id,
          prevTotalLikes: post.likes,
        });

        if (!success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to like the post',
          });
        }

        return { success: true, msg: 'Liked Removed' };
      } catch (err) {
        console.error('[FORUM_POST_LIKE_ERROR]:', err);

        return trpcErrors(err);
      }
    }),

  getPosts: publicProcedure.input(infiniteSearchValidaion).query(async ({ input }) => {
    const limit = input.limit ?? MAX_SEARCH_RESULTS_LIMIT;
    const cursor = input.cursor;

    try {
      const posts = await getForumPosts(limit + 1, cursor);

      if (!posts)
        return {
          nextCursor: undefined,
          posts: [],
          lastItem: null,
        };

      let nextCursor: typeof cursor | undefined = undefined;
      let lastItem: (typeof posts)[number] | null = null;

      if (posts.length > limit) {
        lastItem = posts.slice(-1)[0];
        const nextItem = posts.pop();
        nextCursor = nextItem?.id;
      }

      return {
        posts,
        nextCursor,
        lastItem,
      };
    } catch (err) {
      console.error('[FORUM_POST_GET_POSTS_ERROR]:', err);

      return trpcErrors(err, 'Failed to get the posts');
    }
  }),
});
