import { PublishedBook } from '@/types/book.types';

import ReusableCard, { GridContainer } from '@/components/ReusableCard';

type BookCardWrapperProps = {
  getBooks: () => Promise<PublishedBook[]>;
};

const BookCardWrapper = async ({ getBooks }: BookCardWrapperProps) => {
  const books = await getBooks();

  return (
    <GridContainer
      classNames={{
        notFound: 'left-0 -translate-x-0',
      }}
      notFound={!books || books.length === 0}
    >
      {books.map((book) => (
        <ReusableCard
          key={book.id}
          data={{
            id: book.id,
            title: book.title,
            href: `/books/${book.id}`,
            thumbnail: book.artwork || '',
            chip: book.availability || 'Free',
          }}
        />
      ))}
    </GridContainer>
  );
};

export default BookCardWrapper;
