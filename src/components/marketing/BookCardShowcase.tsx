import { getPublishedBooks } from '@/services/books.services';
import ReusableCard, { GridContainer } from '../ReusableCard';

const BookCardShowcase = async () => {
  const books = (await getPublishedBooks(5)) || [];

  return (
    <GridContainer position='center' className='mt-8'>
      {books.map((book) => (
        <ReusableCard
          key={book.id}
          data={{
            id: book.id,
            title: book.title,
            href: '/login',
            thumbnail: book.artwork || '',
            chip: book.availability || 'Free',
          }}
        />
      ))}
    </GridContainer>
  );
};

export default BookCardShowcase;
