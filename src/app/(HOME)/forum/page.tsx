import { getForumPosts } from '@/services/forumPosts.services';

import Divider from '@/components/ui/Divider';
import ForumPostWrapper from '@/components/forum/ForumPostWrapper';

const ForumPage = () => {
  return (
    <div className='mt-4'>
      <h2 className='w-[200px] text-xl font-semibold md:text-2xl'>
        Latest Posts <Divider className='mt-1 h-[1px] w-full' />
      </h2>
      <div className='mt-4 space-y-6'>
        <ForumPostWrapper
          getPosts={async () => {
            const posts = await getForumPosts(10);
            if (!posts) return [];
            return posts;
          }}
        />
      </div>
    </div>
  );
};

export default ForumPage;
