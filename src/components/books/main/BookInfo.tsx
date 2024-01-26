import { BookInfo } from '@/types/book.types';

import BookInfoRight from './BookInfoRight';
import BookInfoLeft from './BookInfoLeft';

type BookInfoProps = {
  getBook: () => Promise<{
    book: NonNullable<BookInfo>;
    isPurchased: boolean;
    userId: string | null;
  }>;
};

const BookInfo = async ({ getBook }: BookInfoProps) => {
  const { book, isPurchased } = await getBook();

  return (
    <div className='grid h-full w-full grid-cols-1 place-content-between place-items-start gap-12 md:grid-cols-2'>
      <BookInfoLeft
        frontArtwork={book?.frontArtwork || ''}
        backArtwork={book?.backArtwork || ''}
        title={book.title}
      />

      <BookInfoRight book={book} isPurchased={isPurchased} />
    </div>
  );
};

export default BookInfo;
