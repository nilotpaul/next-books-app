import { PublishedBook } from '@/types/book.types';

import BookCardClientWrapper from './BookCardClientWrapper';

type BookCardWrapperProps = {
  getBooks: () => Promise<PublishedBook[]>;
};

const BookCardWrapper = async ({ getBooks }: BookCardWrapperProps) => {
  const books = await getBooks();

  return <BookCardClientWrapper books={books} />;
};

export default BookCardWrapper;
