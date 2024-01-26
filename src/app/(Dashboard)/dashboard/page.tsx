import { userSession } from '@/services/auth.services';
import { User } from '@clerk/nextjs/server';
import { Suspense, cache } from 'react';
import DashSidebarSkeleton from '@/components/loadings/DashSidebarSkeleton';
import { getUserById, getUserPurchases } from '@/services/user.services';
import { getBookInfoById, getRatedBookById } from '@/services/books.services';
import { getUserName } from '@/utils/getUserFullName';
import { MAX_SEARCH_RESULTS_LIMIT } from '@/config/constants/search-filters';

import SidebarWrapper from '@/components/dashboard/SidebarWrapper';
import TabsWrapper from '@/components/dashboard/TabsWrapper';
import WriteBooksTabSkeleton from '@/components/loadings/WriteBooksTabSkeleton';
import { getUserForumPosts } from '@/services/forumPosts.services';

const getUserPurchasedBooks = cache(async (userId: string) => {
  const purchases = await getUserPurchases(userId);
  if (!purchases || !purchases.purchasedBooks) return [];

  const { purchasedBooks } = purchases;

  const booksPromise = purchasedBooks.slice(0, MAX_SEARCH_RESULTS_LIMIT + 1).map(async (bookId) => {
    const book = await getBookInfoById(bookId);
    const userBookRating = await getRatedBookById({
      bookId,
      userId,
    });
    return { book, stars: userBookRating?.stars };
  });
  return (await Promise.all(booksPromise)).map(({ book, stars }) => ({
    id: book?.id,
    title: book?.title,
    frontArtwork: book?.frontArtwork,
    stars,
    publishedDate: book?.publicationDate,
  }));
});

const dashboard = () => {
  return (
    <div className='flex w-full flex-col gap-y-4 sm:flex-row sm:gap-x-8 sm:gap-y-0'>
      <Suspense fallback={<DashSidebarSkeleton />}>
        <SidebarWrapper
          getAuthor={async () => {
            const user = (await userSession()) as User;
            return (await getUserById(user.id))?.isAuthor || false;
          }}
        />
      </Suspense>

      <div className='relative h-[calc(100vh-9.5rem)] w-full overflow-y-auto rounded-lg scrollbar-hide scrollbar-thumb-foreground-400 scrollbar-track-rounded-full scrollbar-thumb-rounded scrollbar-w-1.5 sm:h-[calc(100vh-5.5rem)] sm:pr-4 sm:scrollbar'>
        <Suspense fallback={<WriteBooksTabSkeleton />}>
          <TabsWrapper
            getData={async () => {
              const user = (await userSession()) as User;
              const [dbUser, forumPosts, purchasedBooks] = await Promise.all([
                getUserById(user.id),
                getUserForumPosts(user.id, MAX_SEARCH_RESULTS_LIMIT + 1),
                getUserPurchasedBooks(user.id),
              ]);
              return {
                user: {
                  userId: user.id,
                  userImage: user.imageUrl,
                  name: getUserName(user.firstName || '', user.lastName || '').fullName,
                },
                isAuthor: dbUser?.isAuthor || false,
                forumPosts: forumPosts || [],
                purchasedBooks,
              };
            }}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default dashboard;
