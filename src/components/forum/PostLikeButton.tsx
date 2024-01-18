'use client';

import { trpc } from '@/lib/trpc/TRPCProvider';

import { ThumbsUp } from 'lucide-react';
import { cn } from '@/utils/utils';
import { toast } from 'sonner';

type PostLikeButtonProps = {
  postId: string;
  userId: string;
  likes: string[];
  className?: string;
};

const PostLikeButton = ({ className, postId, likes, userId }: PostLikeButtonProps) => {
  const utils = trpc.useUtils();

  const { mutate: likePost } = trpc.forumPostRouter.like.useMutation({
    onMutate: async ({ postId }) => {
      await utils.forumPostRouter.getPosts.cancel();
      const prevData = utils.forumPostRouter.getPosts.getData();

      const post = prevData?.find((post) => post.id === postId);

      if (!post?.likes?.includes(userId)) {
        utils.forumPostRouter.getPosts.setData(undefined, () => {
          const newPosts = prevData?.map(({ id, ...rest }) => {
            if (post?.id === id) {
              rest.likes?.push(userId);
              return { id, ...rest };
            }

            return { id, ...rest };
          });

          return newPosts;
        });
        return;
      }

      utils.forumPostRouter.getPosts.setData(undefined, () => {
        const newPosts = prevData?.map(({ id, ...rest }) => {
          if (post?.id === id) {
            return {
              ...rest,
              id,
              likes: rest.likes?.filter((item) => item !== userId) || rest.likes,
            };
          }

          return { id, ...rest };
        });

        return newPosts;
      });

      return { prevData };
    },
    onSuccess: ({ success, msg }) => {
      if (success) {
        toast.success(msg);
      }
      utils.forumPostRouter.getPosts.invalidate();
    },
    onError: (err, _, prevData) => {
      console.error(err);
      utils.forumPostRouter.getPosts.setData(undefined, () => prevData?.prevData);
      utils.forumPostRouter.getPosts.invalidate();

      toast.error(err.message);
    },
  });

  return (
    <div className='flex items-center gap-3'>
      <ThumbsUp
        onClick={() => likePost({ postId })}
        className={cn(
          'h-4 w-4 cursor-pointer text-danger',
          {
            'fill-danger': likes.includes(userId),
          },
          className
        )}
      />
      <span className='text-xs text-danger'>{likes.length}</span>
    </div>
  );
};

export default PostLikeButton;
