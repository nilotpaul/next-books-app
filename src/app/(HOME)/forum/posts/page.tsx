import { getForumPosts } from '@/services/forumPosts.services';
import { userSession } from '@/services/auth.services';
import { Suspense } from 'react';

import Divider from '@/components/ui/Divider';
import ForumPostWrapper from '@/components/forum/ForumPostWrapper';
import PostListSkeleton from '@/components/loadings/PostListSkeleton';

const ForumPage = () => {
  return (
    <div className='mt-4'>
      <h2 className='w-[200px] text-xl font-semibold md:text-2xl'>
        Latest Posts <Divider className='mt-1 h-[1px] w-full' />
      </h2>
      <div className='mt-4 space-y-6'>
        <Suspense fallback={<PostListSkeleton />}>
          <ForumPostWrapper
            getPosts={async () => {
              const [posts, user] = await Promise.all([getForumPosts(10), userSession()]);
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
