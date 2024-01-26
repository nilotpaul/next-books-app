import { getPublishedBooks } from '@/services/books.services';
import { Suspense } from 'react';
import { MAX_SEARCH_RESULTS_LIMIT } from '@/config/constants/search-filters';

import BookCardWrapper from '@/components/books/main/BookCardWrapper';
import BookCardSkeleton from '@/components/loadings/BookCardSkeleton';
import { GridContainer } from '@/components/ReusableCard';
import Heading from '@/components/Heading';

const BooksPage = () => {
  return (
    <div className='mt-4'>
      <Heading classNames={{ divider: 'h-px' }}>Popular Books</Heading>

      <div className='mt-6'>
        <Suspense
          fallback={
            <GridContainer>
              <BookCardSkeleton />
            </GridContainer>
          }
        >
          <BookCardWrapper
            getBooks={async () => {
              const books = await getPublishedBooks(MAX_SEARCH_RESULTS_LIMIT + 1);
              if (!books) return [];
              return books;
            }}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default BooksPage;
