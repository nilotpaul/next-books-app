import { FullForumPost } from '@/types/forumPost.types';

import ForumPostsClientWrapper from './ForumPostsClientWrapper';

type ForumPostWrapperProps = {
  getPosts: () => Promise<{ posts: FullForumPost[]; userId: string }>;
};

const ForumPostWrapper = async ({ getPosts }: ForumPostWrapperProps) => {
  const { posts, userId } = await getPosts();

  return <ForumPostsClientWrapper posts={posts} userId={userId} />;
};

export default ForumPostWrapper;
