import { getForumPosts } from '@/services/forumPosts.services';
import { Suspense } from 'react';
import { MAX_SEARCH_RESULTS_LIMIT } from '@/config/constants/search-filters';
import { constructMetadata } from '@/lib/constructMetadata';

import ForumPostWrapper from '@/components/forum/ForumPostWrapper';
import PostListSkeleton from '@/components/loadings/PostListSkeleton';
import Heading from '@/components/Heading';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const metadata = constructMetadata({
  title: 'Forum Posts',
  description:
    'Community where users can engage in discussions and opinions regarding various topics.',
});

const ForumPage = () => {
  return (
    <div className='mt-4'>
      <Heading>Latest Posts</Heading>

      <div className='mt-6 space-y-6'>
        <Suspense fallback={<PostListSkeleton />}>
          <ForumPostWrapper
            getPosts={async () => {
              const posts = await getForumPosts(MAX_SEARCH_RESULTS_LIMIT + 1);

              return posts || [];
            }}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default ForumPage;
