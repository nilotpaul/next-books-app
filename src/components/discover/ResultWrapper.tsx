'use client';

import { trpc } from '@/lib/trpc/TRPCProvider';
import { BookFilters } from '@/validations/bookValidation';
import { useEffect, useRef } from 'react';
import { useIntersection } from '@mantine/hooks';
import { MAX_SEARCH_RESULTS_LIMIT } from '@/config/constants/search-filters';
import { PublishedBook } from '@/types/book.types';

import BookCard from '../books/main/BookCard';
import BookCardSkeleton from '../loadings/BookCardSkeleton';

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

  return (
    <BookCard mantineRef={mantineRef} books={data?.pages.flatMap((pages) => pages.books) || []} />
  );
};

export default ResultWrapper;
