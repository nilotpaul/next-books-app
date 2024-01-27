import { userSession } from '@/services/auth.services';
import { getPublishedBooks } from '@/services/books.services';

import ReusableCard, { GridContainer } from '../ReusableCard';

const BookCardShowcase = async () => {
  const [booksData, user] = await Promise.all([getPublishedBooks(6), userSession()]);
  const books = booksData || [];

  const buildItemHref = (bookId: string) => {
    const itemHref = !user?.id ? '/sign-in' : `/books/${bookId}`;

    return itemHref;
  };

  return (
    <GridContainer position='center' className='mt-8 place-content-center'>
      {books.map((book) => (
        <ReusableCard
          key={book.id}
          data={{
            id: book.id,
            title: book.title,
            href: buildItemHref(book.id),
            thumbnail: book.artwork || '',
            chip: book.availability || 'Free',
          }}
        />
      ))}
    </GridContainer>
  );
};

export default BookCardShowcase;
