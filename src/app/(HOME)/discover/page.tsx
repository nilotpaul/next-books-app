import { Suspense } from 'react';

import FilterResults from '@/components/discover/FilterResults';
import Filters from '@/components/discover/Filters';
import BookCardSkeleton from '@/components/loadings/BookCardSkeleton';
import { GridContainer } from '@/components/ReusableCard';
import Heading from '@/components/Heading';

export const runtime = 'edge';
export const preferredRegion = ['sin1', 'cle1'];

type DiscoverPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const DiscoverPage = ({ searchParams }: DiscoverPageProps) => {
  return (
    <div className='space-y-8'>
      <Filters />

      <section className='w-full space-y-4'>
        <Heading
          classNames={{
            heading:
              'text-center mb-4 relative mx-auto w-fit text-base font-semibold xs:text-lg md:text-xl',
            divider: 'absolute w-[calc(100%+2rem)] -translate-x-1/2 left-1/2',
          }}
        >
          Book Results
        </Heading>

        <Suspense
          fallback={
            <GridContainer>
              <BookCardSkeleton />
            </GridContainer>
          }
        >
          <FilterResults
            searchParams={Object.fromEntries(
              Object.entries(searchParams).filter(([key]) => key !== 'q')
            )}
          />
        </Suspense>
      </section>
    </div>
  );
};

export default DiscoverPage;
