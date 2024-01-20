'use client';

import { PublishedBook } from '@/types/book.types';
import { MAX_SEARCH_RESULTS_LIMIT } from '@/config/constants/search-filters';
import { trpc } from '@/lib/trpc/TRPCProvider';
import { useIntersection } from '@mantine/hooks';
import { useEffect, useRef } from 'react';

import ReusableCard, { GridContainer } from '@/components/ReusableCard';
import BookCardSkeleton from '@/components/loadings/BookCardSkeleton';

type BookCardClientWrapperProps = {
  books: PublishedBook[];
};

const BookCardClientWrapper = ({ books: initialBooks }: BookCardClientWrapperProps) => {
  const lastBookRef = useRef<HTMLDivElement | null>(null);
  const { ref, entry } = useIntersection({
    root: lastBookRef.current,
    threshold: 1,
  });

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    trpc.bookRouter.getBooks.useInfiniteQuery(
      {
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
                  ? initialBooks.slice(-1)[0].id
                  : undefined,
              lastItem: initialBooks.slice(-1)[0],
            },
          ],
        },
        enabled: false,
      }
    );

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  }, [entry, hasNextPage, fetchNextPage]);

  const books = data?.pages.flatMap((page) => page.books) || [];
  const uniqueBookIds = new Set(books.map((book) => book.id));
  data?.pages.flatMap(({ lastItem }) => {
    if (!hasNextPage && lastItem?.id && !uniqueBookIds.has(lastItem.id)) {
      books.push(lastItem);
    }
  });

  return (
    <>
      <GridContainer
        classNames={{
          notFound: 'left-0 -translate-x-0',
        }}
        notFound={!books || books.length === 0}
      >
        {[...books]
          .filter((book, idx, self) => idx === self.findIndex((b) => b.id === book.id))
          .map((book) => (
            <div ref={books.slice(-1)[0].id === book.id ? ref : undefined} key={book.id}>
              <ReusableCard
                data={{
                  id: book.id,
                  title: book.title,
                  href: `/books/${book.id}`,
                  thumbnail: book.artwork || '',
                  chip: book.availability || 'Free',
                }}
              />
            </div>
          ))}
        {isFetchingNextPage && <BookCardSkeleton cards={MAX_SEARCH_RESULTS_LIMIT} />}
      </GridContainer>
    </>
  );
};

export default BookCardClientWrapper;
