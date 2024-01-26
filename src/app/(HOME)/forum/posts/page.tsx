import { getForumPosts } from '@/services/forumPosts.services';
import { userSession } from '@/services/auth.services';
import { Suspense } from 'react';
import { MAX_SEARCH_RESULTS_LIMIT } from '@/config/constants/search-filters';

import ForumPostWrapper from '@/components/forum/ForumPostWrapper';
import PostListSkeleton from '@/components/loadings/PostListSkeleton';
import Heading from '@/components/Heading';

export const runtime = 'edge';
export const preferredRegion = ['sin1', 'cle1', 'fra1'];

const ForumPage = () => {
  return (
    <div className='mt-4'>
      <Heading>Latest Posts</Heading>

      <div className='mt-6 space-y-6'>
        <Suspense fallback={<PostListSkeleton />}>
          <ForumPostWrapper
            getPosts={async () => {
              const [posts, user] = await Promise.all([
                getForumPosts(MAX_SEARCH_RESULTS_LIMIT + 1),
                userSession(),
              ]);
              return {
                posts: posts || [],
                userId: user?.id!,
              };
            }}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default ForumPage;
