import BookCardWrapper from '@/components/books/main/BookCardWrapper';
import BookCardSkeleton from '@/components/loadings/BookCardSkeleton';
import Divider from '@/components/ui/Divider';
import { getPublishedBooks } from '@/services/books.services';
import { Suspense } from 'react';

const BooksPage = () => {
  return (
    <div className='mt-4'>
      <h2 className='w-[200px] text-xl font-semibold md:text-2xl'>
        Popular Books <Divider className='mt-1 h-[1px] w-full' />
      </h2>
      <div className='mt-4'>
        <Suspense fallback={<BookCardSkeleton />}>
          {/* todo: only published should show up */}
          <BookCardWrapper getBooks={async () => await getPublishedBooks()} />
        </Suspense>
      </div>
    </div>
  );
};

export default BooksPage;
