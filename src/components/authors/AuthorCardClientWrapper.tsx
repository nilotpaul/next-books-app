'use client';

import { useEffect, useRef } from 'react';
import { useIntersection } from '@mantine/hooks';
import { AuthorByStars } from '@/types/author.types';
import { trpc } from '@/lib/trpc/TRPCProvider';
import { MAX_SEARCH_RESULTS_LIMIT } from '@/config/constants/search-filters';

import ReusableCard, { GridContainer } from '../ReusableCard';
import BookCardSkeleton from '../loadings/BookCardSkeleton';

type AuthorCardClientWrapperProps = {
  authors: AuthorByStars[];
};

const AuthorCardClientWrapper = ({ authors: initialAuthors }: AuthorCardClientWrapperProps) => {
  const lastAuthorRef = useRef<HTMLDivElement | null>(null);
  const { ref, entry } = useIntersection({
    root: lastAuthorRef.current,
    threshold: 1,
  });

  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } =
    trpc.authorRouter.getAuthors.useInfiniteQuery(
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
              authors: initialAuthors.slice(0, -1),
              nextCursor:
                initialAuthors.length > MAX_SEARCH_RESULTS_LIMIT
                  ? initialAuthors.slice(-1)[0].id
                  : undefined,
              lastItem: initialAuthors.slice(-1)[0],
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

  const authors = data?.pages.flatMap((page) => page.authors) || [];
  const uniqueAuthorIds = new Set(authors.map((author) => author.id));
  data?.pages.flatMap(({ lastItem }) => {
    if (!hasNextPage && lastItem?.id && !uniqueAuthorIds.has(lastItem.id)) {
      authors.push(lastItem);
    }
  });

  return (
    <GridContainer
      classNames={{
        notFound: 'left-0 -translate-x-0',
      }}
      notFound={!authors || authors.length === 0}
    >
      {[...authors]
        .filter((author, idx, self) => idx === self.findIndex((b) => b.id === author.id))
        .map((author) => (
          <div ref={authors.slice(-1)[0].id === author.id ? ref : undefined} key={author.id}>
            <ReusableCard
              data={{
                id: author.id,
                title: author.authorName,
                thumbnail: author.authorImage || '',
                href: '',
                chip: `Stars: ${author.stars || 0}`,
              }}
            />
          </div>
        ))}
      {isFetchingNextPage && <BookCardSkeleton cards={MAX_SEARCH_RESULTS_LIMIT} />}
    </GridContainer>
  );
};

export default AuthorCardClientWrapper;
