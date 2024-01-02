import { userSession } from '@/services/auth.services';
import { getAuthorWithBooksById } from '@/services/author.services';
import { User } from '@clerk/nextjs/server';
import { omit } from 'lodash';
import { redirect } from 'next/navigation';

import DashSidebar from '@/components/dashboard/DashSidebar';
import ManageDashTabs from '@/components/dashboard/ManageDashTabs';

const dashboard = async () => {
  const { id: userId } = (await userSession()) as User;
  const { isAuthor, books: booksWithAllInfo, author } = await getAuthorWithBooksById(userId);

  const books = booksWithAllInfo.map((books) => {
    return {
      authorImage: author.author_image,
      authorName: author.authorName,
      ...omit(books, ['normalised_title']),
    };
  });

  if (!isAuthor) {
    return redirect('/');
  }

  return (
    <div className='flex w-full flex-col gap-y-4 sm:flex-row sm:gap-x-8 sm:gap-y-0'>
      <DashSidebar isAuthor={isAuthor} />

      <div className='relative h-[calc(100vh-9.5rem)] w-full overflow-y-auto rounded-lg scrollbar-hide scrollbar-track-default scrollbar-thumb-foreground-400 scrollbar-track-rounded-full scrollbar-thumb-rounded scrollbar-w-1.5 sm:h-[calc(100vh-5.5rem)] sm:pr-4 sm:scrollbar'>
        <ManageDashTabs userId={userId} books={books} />
      </div>
    </div>
  );
};

export default dashboard;
