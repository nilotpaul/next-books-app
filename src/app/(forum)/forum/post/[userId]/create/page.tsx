import { getUserById } from '@/services/user.services';
import { redirect } from 'next/navigation';

import CreatePostWrapper from '@/components/forum/CreatePostWrapper';

type ForumPostCreatePageProps = {
  params: {
    userId: string;
  };
};

const ForumPostCreatePage = async ({ params }: ForumPostCreatePageProps) => {
  const { userId } = params;

  const user = await getUserById(userId);

  if (user?.clerkId !== userId) {
    return redirect('/dashboard');
  }

  return <CreatePostWrapper userId={userId} isAuthor={user.isAuthor || false} />;
};

export default ForumPostCreatePage;
