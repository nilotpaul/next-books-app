import { BookInfo } from '@/types/book.types';
import { notFound } from 'next/navigation';

import BookInfoRight from './BookInfoRight';
import BookInfoLeft from './BookInfoLeft';

type BookInfoProps = {
  getBook: () => Promise<BookInfo>;
};

const BookInfo = async ({ getBook }: BookInfoProps) => {
  const book = await getBook();

  if (!book?.id) {
    return notFound();
  }

  return (
    <div className='grid h-full w-full place-content-between place-items-start gap-8 md:grid-cols-2'>
      <BookInfoLeft
        frontArtwork={book.frontArtwork!}
        backArtwork={book.backArtwork!}
        title={book.title!}
      />

      <BookInfoRight book={book} />
    </div>
  );
};

export default BookInfo;
