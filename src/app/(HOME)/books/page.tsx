import BookCard from '@/components/books/main/BookCard';
import BookCardSkeleton from '@/components/loadings/BookCardSkeleton';
import Divider from '@/components/ui/Divider';
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
          <BookCard />
        </Suspense>
      </div>
    </div>
  );
};

export default BooksPage;
