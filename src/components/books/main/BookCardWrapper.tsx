import { PublishedBook } from '@/types/book.types';
import BookCard from './BookCard';

type BookCardWrapperProps = {
  getBooks: () => Promise<PublishedBook[]>;
};

const BookCardWrapper = async ({ getBooks }: BookCardWrapperProps) => {
  const books = await getBooks();

  return <BookCard books={books} />;
};

export default BookCardWrapper;
