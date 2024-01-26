'use client';

import { useEffect, useRef } from 'react';
import { FullForumPost } from '@/types/forumPost.types';
import { trpc } from '@/lib/trpc/TRPCProvider';
import { useIntersection } from '@mantine/hooks';
import { MAX_SEARCH_RESULTS_LIMIT } from '@/config/constants/search-filters';

import ResuablePostList from '../ReusablePostList';
import PostLikeButton from './PostLikeButton';
import EmptyArrayFallback from '../EmptyArrayFallback';
import PostListSkeleton from '../loadings/PostListSkeleton';

type ForumPostsClientWrapperProps = {
  posts: FullForumPost[];
  userId: string;
};

const ForumPostsClientWrapper = ({ posts: initialPosts, userId }: ForumPostsClientWrapperProps) => {
  const lastPostRef = useRef<HTMLDivElement | null>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    trpc.forumPostRouter.getPosts.useInfiniteQuery(
      {
        limit: MAX_SEARCH_RESULTS_LIMIT,
      },
      {
        suspense: true,
        initialData: {
          pageParams: [undefined],
          pages: [
            {
              nextCursor:
                initialPosts.length > MAX_SEARCH_RESULTS_LIMIT
                  ? initialPosts.slice(-1)[0].id
                  : undefined,
              posts: initialPosts.slice(0, -1),
              lastItem: initialPosts.slice(-1)[0],
            },
          ],
        },
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
      }
    );

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, entry]);

  const posts = data?.pages.flatMap((page) => page.posts) || [];
  const uniquePostIds = new Set(posts.map((post) => post.id));
  data?.pages.flatMap(({ lastItem }) => {
    if (!hasNextPage && lastItem?.id && !uniquePostIds.has(lastItem.id)) {
      posts.push(lastItem);
    }
  });

  return (
    <div className='relative mb-6'>
      {posts.length !== 0 ? (
        [...posts]
          .filter((post, idx, self) => idx === self.findIndex((p) => p.id === post.id))
          ?.map((post) => {
            return (
              <div ref={posts.slice(-1)[0].id === post.id ? ref : undefined} key={post.id}>
                <ResuablePostList
                  data={{
                    id: post.id,
                    title: post.postTitle,
                    thumbnail: post.image,
                    date: post.createdAt,
                  }}
                  content={post.content}
                  lastItem={posts.slice(-1)[0].id === post.id}
                  topRightElement={
                    <PostLikeButton likes={post.likes || []} userId={userId} postId={post.id} />
                  }
                />
              </div>
            );
          })
      ) : (
        <EmptyArrayFallback className='left-0 -translate-x-0' message='No posts to show' />
      )}
      {isFetchingNextPage && <PostListSkeleton />}
    </div>
  );
};

export default ForumPostsClientWrapper;
