'use client';

import { trpc } from '@/lib/trpc/TRPCProvider';
import { BookFilters } from '@/validations/bookValidation';
import { useEffect } from 'react';
import { MAX_SEARCH_RESULTS_LIMIT } from '@/config/constants/search-filters';
import { PublishedBook } from '@/types/book.types';

import BookCardSkeleton from '../loadings/BookCardSkeleton';
import ReusableCard, { GridContainer } from '../ReusableCard';
import { Button } from '@nextui-org/button';
import EmptyArrayFallback from '../EmptyArrayFallback';

type ResultWrapperProps = {
  books: PublishedBook[];
  filters: BookFilters;
};

const ResultWrapper = ({ books: initialBooks, filters }: ResultWrapperProps) => {
  const { data, isFetchingNextPage, refetch, fetchNextPage, hasNextPage, isFetching } =
    trpc.bookRouter.filter.useInfiniteQuery(
      {
        ...filters,
        limit: MAX_SEARCH_RESULTS_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        suspense: true,
        initialData: {
          pageParams: [undefined],
          pages: [
            {
              books: initialBooks.slice(0, -1),
              nextCursor:
                initialBooks.length > MAX_SEARCH_RESULTS_LIMIT
                  ? initialBooks.slice(-1)[0]?.id
                  : undefined,
              lastItem: initialBooks.slice(-1)[0],
            },
          ],
        },
        enabled: false,
      }
    );

  const isEmpty = Object.values(filters).length === 0;

  useEffect(() => {
    if (isEmpty) return;
    refetch();
  }, [refetch, filters, isEmpty]);

  const books = data?.pages.flatMap((pages) => pages.books) || [];
  const uniqueBookIds = new Set(books.map((book) => book.id));
  data?.pages.flatMap(({ lastItem }) => {
    if (!hasNextPage || isEmpty) {
      if (lastItem?.id && !uniqueBookIds.has(lastItem.id)) {
        books.push(lastItem);
      }
    }
  });

  if (isFetching || isFetchingNextPage) {
    return (
      <GridContainer>
        <BookCardSkeleton cards={MAX_SEARCH_RESULTS_LIMIT} />
      </GridContainer>
    );
  }

  return (
    <div className='relative pt-2'>
      <GridContainer>
        {[...books]
          .filter((book, idx, self) => idx === self.findIndex((b) => b.id === book.id))
          .map((book) => (
            <ReusableCard
              key={book.id}
              data={{
                id: book.id,
                title: book.title,
                thumbnail: book.artwork || '',
                href: `/books/${book.id}`,
                chip: book.availability || 'Free',
              }}
            />
          ))}
        {(!books || books.length === 0) && <EmptyArrayFallback message='No Books Found' />}
      </GridContainer>

      {hasNextPage && !isEmpty && (
        <Button
          size='sm'
          className='absolute right-0 mt-6 font-medium'
          onClick={() => hasNextPage && !isEmpty && fetchNextPage()}
        >
          Load More
        </Button>
      )}
    </div>
  );
};

export default ResultWrapper;
