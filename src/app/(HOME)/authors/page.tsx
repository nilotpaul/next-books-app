import { getAuthorsByStars } from '@/services/author.services';
import { constructMetadata } from '@/lib/constructMetadata';
import { Suspense } from 'react';

import { GridContainer } from '@/components/ReusableCard';
import AuthorCardWrapper from '@/components/authors/AuthorCardWrapper';
import AuthorCardSkeleton from '@/components/loadings/AuthorCardSkeleton';
import Heading from '@/components/Heading';

export const runtime = 'edge';
export const preferredRegion = ['sin1', 'cle1'];

export const metadata = constructMetadata({
  title: 'Popular Authors',
  description: 'A list of most popular authors in booksgod',
});

const AuthorsPage = () => {
  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading>Popular Authors</Heading>

        {/* <AuthorPageFilters /> will do the filters later */}
      </div>

      <div className='mt-6'>
        <Suspense
          fallback={
            <GridContainer>
              <AuthorCardSkeleton />
            </GridContainer>
          }
        >
          <AuthorCardWrapper
            getAuthorData={async () => {
              const authors = await getAuthorsByStars();
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
