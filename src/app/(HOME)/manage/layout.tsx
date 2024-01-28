import { Suspense } from 'react';

import ManageSkeleton from '@/components/loadings/ManageSkeleton';
import ManageTabs from '@/components/manage/ManageTabs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function ManageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='w-full space-y-4 sm:flex sm:gap-x-8 sm:space-y-0'>
      <ManageTabs />

      <div className='relative w-full overflow-y-auto rounded-lg scrollbar-hide scrollbar-thumb-foreground-400 scrollbar-track-rounded-full scrollbar-thumb-rounded scrollbar-w-1.5 sm:h-[calc(100vh-5.5rem)] sm:pr-4 sm:scrollbar'>
        <Suspense fallback={<ManageSkeleton />}>{children}</Suspense>
      </div>
    </div>
  );
}
