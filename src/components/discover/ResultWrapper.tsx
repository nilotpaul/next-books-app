'use client';

import { trpc } from '@/lib/trpc/TRPCProvider';
import { BookFilters } from '@/validations/bookValidation';
import { useEffect, useRef } from 'react';
import { useIntersection } from '@mantine/hooks';
import { MAX_SEARCH_RESULTS_LIMIT } from '@/config/constants/search-filters';
import { PublishedBook } from '@/types/book.types';

import BookCardSkeleton from '../loadings/BookCardSkeleton';
import ReusableCard, { GridContainer } from '../ReusableCard';

type ResultWrapperProps = {
  books: PublishedBook[];
  filters: BookFilters;
};

const ResultWrapper = ({ books, filters }: ResultWrapperProps) => {
  // todo: later only published books will show up
  const lastItemRef = useRef<HTMLDivElement | null>(null);
  const { ref: mantineRef, entry } = useIntersection({
    root: lastItemRef.current,
    threshold: 1,
  });

  const { data, isFetching, isFetchingNextPage, refetch, fetchNextPage, hasNextPage } =
    trpc.bookRouter.filter.useInfiniteQuery(
      {
        ...filters,
        limit: MAX_SEARCH_RESULTS_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        keepPreviousData: true,
        suspense: true,
        initialData: {
          pageParams: [undefined],
          pages: [{ books, nextCursor: undefined }],
        },
        enabled: false,
        refetchOnWindowFocus: false,
      }
    );

  const isEmpty = Object.values(filters).length === 0;

  useEffect(() => {
    if (isEmpty) return;
    refetch();
  }, [refetch, filters]);

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  }, [entry, hasNextPage, fetchNextPage]);

  if (isFetching || isFetchingNextPage) {
    return <BookCardSkeleton cards={3} />;
  }

  const fetchedBooks = data?.pages.flatMap((pages) => pages.books);
  const isBookEmpty = data?.pages.length === 0;

  return (
    <GridContainer notFound={!fetchedBooks || isBookEmpty}>
      {fetchedBooks?.map((book) => (
        <div
          key={book.id}
          ref={fetchedBooks.slice(0, -1)[0].id === book.id ? mantineRef : undefined}
        >
          <ReusableCard
            data={{
              id: book.id,
              title: book.title,
              thumbnail: book.artwork || '',
              href: `/books/${book.id}`,
              chip: book.availability || 'Free',
            }}
          />
        </div>
      ))}
    </GridContainer>
  );
};

export default ResultWrapper;
