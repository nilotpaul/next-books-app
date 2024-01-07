import { Suspense } from 'react';

import ReaderSkeleton from '@/components/loadings/ReaderSkeleton';

type ReadBookProps = {
  children: React.ReactNode;
};

const ReadBook = ({ children }: ReadBookProps) => {
  return (
    <div className='mt-3 h-screen p-3 py-0 md:mt-0 md:p-4'>
      <Suspense fallback={<ReaderSkeleton />}>{children}</Suspense>
    </div>
  );
};

export default ReadBook;
