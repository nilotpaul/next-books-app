import { getBookInfoById } from '@/services/books.services';
import { notFound } from 'next/navigation';

import BookInfo from '@/components/books/main/BookInfo';

type BookInfoPageProps = {
  params: { bookId: string };
};

const BookInfoPage = ({ params }: BookInfoPageProps) => {
  const { bookId } = params;

  if (!bookId) {
    return notFound();
  }

  return (
    <BookInfo
      getBook={async () => {
        const book = await getBookInfoById(bookId);
        if (!book?.id) {
          return notFound();
        }
        return book;
      }}
    />
  );
};

export default BookInfoPage;
