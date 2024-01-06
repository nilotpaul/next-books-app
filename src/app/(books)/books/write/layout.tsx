import EditorTopBarSkeleton from '@/components/loadings/EditorTopBarSkeleton';
import { Suspense } from 'react';

type WriteBookProps = {
  children: React.ReactNode;
};

const WriteBook = ({ children }: WriteBookProps) => {
  return (
    <div className='p-4'>
      <Suspense fallback={<EditorTopBarSkeleton />}>{children}</Suspense>
    </div>
  );
};

export default WriteBook;
