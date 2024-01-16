import { getAuthorsByStars } from '@/services/author.services';
import { Suspense } from 'react';

import AuthorCardWrapper from '@/components/authors/AuthorCardWrapper';
import AuthorCardSkeleton from '@/components/loadings/AuthorCardSkeleton';
import AuthorPageFilters from '@/components/authors/AuthorPageFilters';
import Divider from '@/components/ui/Divider';

const AuthorsPage = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  return (
    <>
      <div className='flex items-center justify-between'>
        <h2 className='w-[230px] text-xl font-semibold md:text-2xl'>
          Popular Authors <Divider className='mt-1' />
        </h2>

        <AuthorPageFilters />
      </div>

      <div className='mt-4'>
        <Suspense fallback={<AuthorCardSkeleton />}>
          <AuthorCardWrapper
            getAuthorData={async () => {
              const sort = searchParams?.sort === 'stars' ? 'stars' : 'authorName';
              const order = searchParams?.sort === 'a-z' ? 'asc' : 'desc';
              const authors = await getAuthorsByStars({
                order,
                sort,
              });
              if (!authors || !authors[0].id) return [];
              return authors.map((author) => ({
                id: author.id,
                authorName: author.authorName,
                authorImage: author.authorImage,
                stars: author.stars || 0,
              }));
            }}
          />
        </Suspense>
      </div>
    </>
  );
};

export default AuthorsPage;
