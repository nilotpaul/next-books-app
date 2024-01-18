import { trpc } from '@/lib/trpc/TRPCProvider';
import { format } from 'date-fns';

import { TableCell, TableRow } from '@nextui-org/table';
import Image from '../ui/Image';
import { Button } from '@nextui-org/button';
import Link from '../ui/Link';
import { Skeleton } from '@nextui-org/skeleton';
import { toast } from 'sonner';
import Stars from '../books/main/Stars';
import ReusableTable from '../ReusableTable';

const PurchaseTab = () => {
  const { data, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage } =
    trpc.userRouter.purchases.useInfiniteQuery(
      {
        limit: 6,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 2,
        retryDelay: 800,
        onSettled: (_, err) => {
          if (err?.message.length) {
            toast.error(err.message);
          }
        },
      }
    );

  if (isFetching || isFetchingNextPage) {
    return <Skeleton className='h-36 w-full rounded-lg' />;
  }

  const books = data?.pages.flatMap((pages) => pages?.books);
  const isEmpty = data?.pages.flatMap((pages) => pages?.books).length === 0;

  return (
    <>
      <ReusableTable
        type='Purchased Books'
        columns={['Artwork', 'Title', 'Published', 'Rating', 'Options']}
        rows={isEmpty ? [] : books!}
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
          <Button size='sm' onClick={() => hasNextPage && fetchNextPage()}>
            Load More
          </Button>
        </div>
      )}
    </>
  );
};

export default PurchaseTab;
