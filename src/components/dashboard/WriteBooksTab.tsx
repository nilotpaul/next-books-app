import { BooksWithoutNT } from '@/types/book.types';
import BookTable from './BookTable';

type WriteBooksTab = {
  books: (BooksWithoutNT[number] & { authorImage: string | null; authorName: string | null })[];
};

const WriteBooksTab = ({ books }: WriteBooksTab) => {
  const sortedBooks = books.sort((a, b) => a.status.length - b.status.length);

  return (
    <div>
      <BookTable type='Draft Books Table' books={sortedBooks} />
    </div>
  );
};

export default WriteBooksTab;
