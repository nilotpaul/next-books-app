import { getUserById } from '@/services/user.services';
import { redirect } from 'next/navigation';

import CreatePostWrapper from '@/components/forum/CreatePostWrapper';
import { userSession } from '@/services/auth.services';

type ForumPostCreatePageProps = {
  params: {
    userId: string;
  };
};

const ForumPostCreatePage = async ({ params }: ForumPostCreatePageProps) => {
  const { userId } = params;

  const [user, session] = await Promise.all([getUserById(userId), userSession()]);

  if (!user || user?.clerkId !== session?.id) {
    return redirect('/dashboard');
  }

  return <CreatePostWrapper userId={userId} isAuthor={user.isAuthor || false} />;
};

export default ForumPostCreatePage;
