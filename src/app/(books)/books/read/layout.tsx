import ReaderSkeleton from '@/components/loadings/ReaderSkeleton';
import { Suspense } from 'react';

type ReadBookProps = {
  children: React.ReactNode;
};

const ReadBook = ({ children }: ReadBookProps) => {
  return (
    <div className='h-screen p-3 py-0 md:p-4'>
      <Suspense fallback={<ReaderSkeleton />}>{children}</Suspense>
    </div>
  );
};

export default ReadBook;
