import { getPublishedBooks } from '@/services/books.services';
import { Suspense } from 'react';
import { MAX_SEARCH_RESULTS_LIMIT } from '@/config/constants/search-filters';

import BookCardWrapper from '@/components/books/main/BookCardWrapper';
import BookCardSkeleton from '@/components/loadings/BookCardSkeleton';
import Divider from '@/components/ui/Divider';
import { GridContainer } from '@/components/ReusableCard';

const BooksPage = () => {
  return (
    <div className='mt-4'>
      <h2 className='w-[200px] text-xl font-semibold md:text-2xl'>
        Popular Books <Divider className='mt-1 h-[1px] w-full' />
      </h2>
      <div className='mt-4'>
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
