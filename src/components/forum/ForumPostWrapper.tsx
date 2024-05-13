import { FullForumPost } from '@/types/forumPost.types';
import { userSession } from '@/services/auth.services';
import { redis } from '@/lib/redis';

import ForumPostsClientWrapper from './ForumPostsClientWrapper';

type ForumPostWrapperProps = {
  getPosts: () => Promise<FullForumPost[]>;
};

const ForumPostWrapper = async ({ getPosts }: ForumPostWrapperProps) => {
  let posts: FullForumPost[] = [];

  const cachedPostsPromise = redis.get('forum_posts') as Promise<FullForumPost[] | null>;

  const [user, cachedPosts] = await Promise.all([userSession(), cachedPostsPromise]);

  if (!cachedPosts) {
    try {
      const dbPosts = await getPosts();
      posts = dbPosts;

      if (dbPosts.length !== 0) {
        await redis.set('forum_posts', dbPosts, {
          keepTtl: true,
        });
        await redis.expire('forum_posts', 60 * 60 * 2, 'nx');
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error('Failed to get the initial forum posts', err);
      }
      posts = [];
    }
  } else {
    posts = cachedPosts;
  }

  return <ForumPostsClientWrapper posts={posts} userId={user?.id} />;
};

export default ForumPostWrapper;
