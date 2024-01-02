import { BooksWithoutNT } from '@/types/book.types';
import BookTable from './BookTable';

type WriteBooksTab = {
  books: (BooksWithoutNT[number] & { authorImage: string | null; authorName: string | null })[];
};

const WriteBooksTab = ({ books }: WriteBooksTab) => {
  const draftBooks = books.filter((book) => book.status === 'draft');

  return (
    <div>
      <BookTable type='Draft Books Table' books={draftBooks} />
    </div>
  );
};

export default WriteBooksTab;
