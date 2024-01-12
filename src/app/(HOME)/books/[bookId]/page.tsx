import { getBookInfoById } from '@/services/books.services';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import BookInfo from '@/components/books/main/BookInfo';
import BookInfoSkeleton from '@/components/loadings/BookInfoSkeleton';
import { purchaseStatus } from '@/utils/purchaseStatus';

type BookInfoPageProps = {
  params: { bookId: string };
};

const BookInfoPage = ({ params }: BookInfoPageProps) => {
  const { bookId } = params;

  if (!bookId) {
    return notFound();
  }

  return (
    <Suspense fallback={<BookInfoSkeleton />}>
      <BookInfo
        getBook={async () => {
          const [book, { isPurchased, userId }] = await Promise.all([
            await getBookInfoById(bookId),
            purchaseStatus(bookId),
          ]);
          if (!book?.id) {
            return notFound();
          }
          return {
            book,
            isPurchased: isPurchased || book.clerkId === userId,
          };
        }}
      />
    </Suspense>
  );
};

export default BookInfoPage;
