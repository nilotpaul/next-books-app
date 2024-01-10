import { Suspense } from 'react';

import FilterResults from '@/components/discover/FilterResults';
import Filters from '@/components/discover/Filters';
import BookCardSkeleton from '@/components/loadings/BookCardSkeleton';
import Divider from '@/components/ui/Divider';

type DiscoverPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const DiscoverPage = ({ searchParams }: DiscoverPageProps) => {
  return (
    <div className='space-y-8'>
      <section className='space-y-4'>
        <h2 className='w-[200px] text-xl font-semibold md:text-2xl'>
          Book Filters <Divider className='mt-1 h-[1px] w-full' />
        </h2>
        <Filters />
      </section>

      <section className='space-y-4'>
        <h2 className='text-center text-lg font-semibold md:text-xl'>
          Book Results <Divider className='mx-auto mt-1 h-[1px] w-[200px]' />
        </h2>
        <Suspense fallback={<BookCardSkeleton />}>
          <FilterResults searchParams={searchParams} />
        </Suspense>
      </section>
    </div>
  );
};

export default DiscoverPage;
