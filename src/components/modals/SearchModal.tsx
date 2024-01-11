'use client';

import { useEffect } from 'react';
import useSearchParams from '@/hooks/useSearchParams';
import { useDebounce } from '@/hooks/useDebounce';
import { MAX_SEARCH_RESULTS_LIMIT } from '@/config/constants/search-filters';
import { trpc } from '@/lib/trpc/TRPCProvider';
import { useRouter } from 'next/navigation';
import { bookGenres } from '@/config/constants/author';

import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { BookHeart, SearchIcon } from 'lucide-react';
import SearchInput from '../search/SearchInput';
import { cn } from '@/utils/utils';
import { CircularProgress } from '@nextui-org/react';
import SearchedResults from '../search/SearchedResults';
import SearchResultSkeleton from '../loadings/SearchResultSkeleton';

type SearchModalProps = {
  userId: string;
};

const SearchModal = ({ userId }: SearchModalProps) => {
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
  const { getQueryParams } = useSearchParams();
  const debouncedValue = useDebounce(getQueryParams('q') || '', 800);
  const router = useRouter();

  const { data, isFetching, isFetchingNextPage, hasNextPage, refetch, fetchNextPage } =
    trpc.bookRouter.filter.useInfiniteQuery(
      {
        q: debouncedValue,
        limit: MAX_SEARCH_RESULTS_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        keepPreviousData: true,
        suspense: true,
        initialData: {
          pageParams: [undefined],
          pages: [{ books: [], nextCursor: undefined }],
        },
        enabled: false,
        refetchOnWindowFocus: false,
      }
    );

  useEffect(() => {
    if (debouncedValue.length < 2) return;
    refetch();
  }, [debouncedValue, refetch]);

  const books = data?.pages.flatMap((pages) => pages.books);

  return (
    <>
      {userId && (
        <Button onClick={onOpen} size='sm' isIconOnly radius='md'>
          <SearchIcon className='h-5 w-5' />
        </Button>
      )}
      <Modal
        size='xl'
        radius='sm'
        scrollBehavior='inside'
        placement='center'
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          closeButton: 'hidden',
        }}
        className='border-1 border-foreground-100 bg-background'
      >
        <ModalContent>
          <ModalHeader className='p-0'>
            <SearchInput />
          </ModalHeader>

          <ModalBody className='p-2'>
            {debouncedValue.length >= 0 && debouncedValue.length < 2 ? (
              <>
                {bookGenres.slice(0, 5).map((genre, index) => (
                  <Button
                    onClick={() => {
                      onClose();
                      router.push(`/discover?genres=${genre.toLowerCase()}`);
                    }}
                    key={index}
                    size='lg'
                    className={cn(
                      'min-h-[4rem] w-full justify-start bg-default-50 pl-4 text-foreground-500 hover:bg-primary hover:text-white',
                      {
                        'hover:bg-danger': (index - 1) % 2 === 0,
                      }
                    )}
                    radius='sm'
                  >
                    <BookHeart className='h-6 w-6' />
                    {genre}
                  </Button>
                ))}
              </>
            ) : (
              books?.map((book) => <SearchedResults key={book.id} book={book} />)
            )}
            {(isFetching || isFetchingNextPage) && <SearchResultSkeleton />}
            {!(debouncedValue.length >= 0 && debouncedValue.length < 2) &&
              !isFetching &&
              !isFetchingNextPage &&
              books?.length === 0 && <p>No books found.</p>}
            {hasNextPage && (
              <Button size='sm' radius='sm' className='font-medium' onClick={() => fetchNextPage()}>
                Load More
              </Button>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SearchModal;