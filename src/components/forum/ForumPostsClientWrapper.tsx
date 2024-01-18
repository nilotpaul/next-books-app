'use client';

import { FullForumPost } from '@/types/forumPost.types';
import { trpc } from '@/lib/trpc/TRPCProvider';

import ResuablePostList from '../ReusablePostList';
import PostLikeButton from './PostLikeButton';

type ForumPostsClientWrapperProps = {
  posts: FullForumPost[];
  userId: string;
};

const ForumPostsClientWrapper = ({ posts: initialPosts, userId }: ForumPostsClientWrapperProps) => {
  const { data: posts } = trpc.forumPostRouter.getPosts.useQuery(undefined, {
    suspense: true,
    initialData: initialPosts,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return posts?.map((post) => {
    return (
      <div className='group'>
        <ResuablePostList
          notFound={!post || posts.length === 0}
          data={{
            id: post.id,
            title: post.postTitle,
            thumbnail: post.image,
            date: post.createdAt,
          }}
          content={post.content}
          topRightElement={
            <PostLikeButton likes={post.likes || []} userId={userId} postId={post.id} />
          }
        />
      </div>
    );
  });
};

export default ForumPostsClientWrapper;
