import { getBookInfoById } from '@/services/books.services';
import { notFound } from 'next/navigation';
import { purchaseStatus } from '@/utils/purchaseStatus';
import { Suspense } from 'react';

import BookInfoSkeleton from '@/components/loadings/BookInfoSkeleton';
import BooksInfo from '@/components/books/main/BookInfo';

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
      <BooksInfo
        getBook={async () => {
          const [book, { isPurchased, userId }] = await Promise.all([
            getBookInfoById(bookId),
            purchaseStatus(bookId),
          ]);
          if (!book || !book?.id) {
            return notFound();
          }
          return {
            book,
            isPurchased: isPurchased || book.clerkId === userId,
            userId,
          };
        }}
      />
    </Suspense>
  );
};

export default BookInfoPage;
