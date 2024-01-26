import { useContext } from 'react';
import { MyDashboardContext } from '../context/DashboardContext';
import { trpc } from '@/lib/trpc/TRPCProvider';
import { MAX_SEARCH_RESULTS_LIMIT } from '@/config/constants/search-filters';

import ReusableTable from '../ReusableTable';
import { TableRow, TableCell } from '@nextui-org/table';
import Image from '../ui/Image';
import { convertPrice } from '@/utils/utils';
import { Chip } from '@nextui-org/chip';
import { Button } from '@nextui-org/button';

const BooksSoldTab = () => {
  const initialAuthorBooks = useContext(MyDashboardContext)?.authorBooks || [];
  const initialBooksWithPurchaseCount = initialAuthorBooks.map((book) => ({
    bookId: book.id,
    title: book.bookTitle,
    image: book.frontArtwork,
    purchaseCount: book.purchaseCount || 0,
    price: Number(book.pricing) || 0,
    status: book.status,
  }));

  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } =
    trpc.authorRouter.getSoldBooks.useInfiniteQuery(
      {
        limit: MAX_SEARCH_RESULTS_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        keepPreviousData: true,
        suspense: true,
        initialData: {
          pageParams: [undefined],
          pages: [
            {
              booksWithPurchaseCount: initialBooksWithPurchaseCount.slice(0, -1),
              nextCursor:
                initialBooksWithPurchaseCount.length > MAX_SEARCH_RESULTS_LIMIT
                  ? initialBooksWithPurchaseCount.slice(-1)[0].bookId
                  : undefined,
              lastItem: initialBooksWithPurchaseCount.slice(-1)[0],
            },
          ],
        },
      }
    );

  const booksWithPurchaseCount = data?.pages.flatMap((page) => page.booksWithPurchaseCount) || [];
  const uniqueBookIds = new Set(booksWithPurchaseCount.map((book) => book.bookId));
  data?.pages.flatMap(({ lastItem }) => {
    if (!hasNextPage && lastItem?.bookId && !uniqueBookIds.has(lastItem.bookId)) {
      booksWithPurchaseCount.push(lastItem);
    }
  });

  return (
    <div className='relative'>
      <ReusableTable
        type='Books Sold'
        columns={['Title', 'Artwork', 'Status', 'Sold', 'Total $']}
        rows={booksWithPurchaseCount.filter((book) => book.status === 'published')}
        map={(book) => (
          <TableRow key={book.bookId}>
            <TableCell>
              <Image
                src={book?.image!}
                alt={book?.title!}
                fill
                classNames={{
                  wrapper: 'min-h-[65px] min-w-[45px]',
                }}
                radius='none'
                className='rounded-md object-cover'
              />
            </TableCell>
            <TableCell className='text-sm font-medium sm:text-base'>{book.title}</TableCell>
            <TableCell>
              {book.status === 'draft' ? (
                <Chip variant='flat' color='warning'>
                  Draft
                </Chip>
              ) : (
                <Chip variant='flat' color='success'>
                  Published
                </Chip>
              )}
            </TableCell>
            <TableCell className='font-medium text-warning'>{book.purchaseCount}</TableCell>
            <TableCell className='font-semibold text-danger'>
              {convertPrice(book.purchaseCount * book.price)}
            </TableCell>
          </TableRow>
        )}
      />

      {hasNextPage && (
        <Button
          isLoading={hasNextPage && isFetchingNextPage}
          onClick={() => hasNextPage && fetchNextPage()}
          size='sm'
          className='absolute right-0 mt-2 font-medium'
        >
          Load More
        </Button>
      )}
    </div>
  );
};

export default BooksSoldTab;
