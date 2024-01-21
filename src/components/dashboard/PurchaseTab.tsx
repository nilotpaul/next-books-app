import { trpc } from '@/lib/trpc/TRPCProvider';
import { format } from 'date-fns';
import { useContext } from 'react';
import { MAX_SEARCH_RESULTS_LIMIT } from '@/config/constants/search-filters';
import { MyDashboardContext } from '../context/DashboardContext';

import { TableCell, TableRow } from '@nextui-org/table';
import Image from '../ui/Image';
import { Button } from '@nextui-org/button';
import Link from '../ui/Link';
import Stars from '../books/main/Stars';
import ReusableTable from '../ReusableTable';

const PurchaseTab = () => {
  const initialPurchases = useContext(MyDashboardContext).purchases;

  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } =
    trpc.userRouter.purchases.useInfiniteQuery(
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
              books: initialPurchases.slice(0, -1),
              nextCursor:
                initialPurchases.length > MAX_SEARCH_RESULTS_LIMIT
                  ? initialPurchases.slice(-1)[0].id
                  : undefined,
              lastItem: initialPurchases.slice(-1)[0],
            },
          ],
        },
        enabled: false,
      }
    );

  const books = data?.pages.flatMap((pages) => pages?.books) || [];
  const uniqueBookIds = new Set(books.map((book) => book.id));
  data?.pages.flatMap(({ lastItem }) => {
    if (!hasNextPage && lastItem?.id && !uniqueBookIds.has(lastItem.id)) {
      books.push(lastItem);
    }
  });

  return (
    <>
      <ReusableTable
        type='Purchased Books'
        columns={['Artwork', 'Title', 'Published', 'Rating', 'Options']}
        rows={[...books].filter(
          (book, idx, self) => idx === self.findIndex((b) => b.id === book.id)
        )}
        map={(book) => (
          <TableRow key={book?.id}>
            <TableCell>
              <Image
                src={book?.frontArtwork!}
                alt={book?.title!}
                fill
                classNames={{
                  wrapper: 'min-h-[65px] min-w-[45px]',
                }}
                radius='none'
                className='rounded-md object-cover'
              />
            </TableCell>
            <TableCell className='text-base'>{book?.title}</TableCell>
            <TableCell className='text-base'>
              {book?.publishedDate && format(book?.publishedDate!, 'dd / mm / yy')}
            </TableCell>
            <TableCell>
              <div className='flex items-center gap-1.5'>
                <Stars
                  key={new Date().toDateString()}
                  size='sm'
                  stars={book.stars || 0}
                  bookId={book.id}
                />
              </div>
            </TableCell>
            <TableCell>
              <Button
                className='font-medium text-black'
                color='success'
                as={Link}
                href={`books/read/${book?.id}`}
              >
                Read
              </Button>
            </TableCell>
          </TableRow>
        )}
      />
      {hasNextPage && (
        <div className='mt-3 flex items-center justify-end'>
          <Button
            isLoading={isFetchingNextPage}
            size='sm'
            className='font-medium'
            onClick={() => hasNextPage && fetchNextPage()}
          >
            Load More
          </Button>
        </div>
      )}
    </>
  );
};

export default PurchaseTab;
