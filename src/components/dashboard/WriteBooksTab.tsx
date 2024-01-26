import { useContext, useState } from 'react';
import { MyDashboardContext } from '../context/DashboardContext';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc/TRPCProvider';
import { MAX_SEARCH_RESULTS_LIMIT } from '@/config/constants/search-filters';
import { toast } from 'sonner';

import ReusableTable from '../ReusableTable';
import { TableRow, TableCell } from '@nextui-org/table';
import { Chip } from '@nextui-org/chip';
import Link from '../ui/Link';
import { Eye, PencilLine, Trash2 } from 'lucide-react';
import { Button } from '@nextui-org/button';
import AlertDialog from '../ui/AlertDialog';

const WriteBooksTab = () => {
  const [isDeleting, setIsDeleting] = useState('');
  const router = useRouter();
  const utils = trpc.useUtils();

  const initialBooks = useContext(MyDashboardContext)?.authorBooks || [];

  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } =
    trpc.authorRouter.getAuthorBooks.useInfiniteQuery(
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
              newbooks: initialBooks.slice(0, -1),
              nextCursor:
                initialBooks.length > MAX_SEARCH_RESULTS_LIMIT
                  ? initialBooks.slice(-1)[0].id
                  : undefined,
              lastItem: initialBooks.slice(-1)[0],
            },
          ],
        },
      }
    );

  const { mutate: deleteBook, isLoading } = trpc.bookRouter.delete.useMutation({
    onMutate: ({ bookId }) => setIsDeleting(bookId),
    onSuccess: () => {
      router.refresh();
      utils.authorRouter.getAuthorBooks.refetch();
      toast.success('Book Deleted');
      setIsDeleting('');
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });

  const books = data?.pages.flatMap((page) => page.newbooks) || [];
  const uniqueBookIds = new Set(books.map((book) => book.id));
  data?.pages.flatMap(({ lastItem }) => {
    if (!hasNextPage && lastItem?.id && !uniqueBookIds.has(lastItem.id)) {
      books.push(lastItem);
    }
  });

  return (
    <div className='relative'>
      <ReusableTable
        type='Draft Books Table'
        columns={['Title', 'Last Updated', 'Status', 'Options']}
        rows={[...books].filter(
          (book, idx, self) => idx === self.findIndex((b) => b.id === book.id)
        )}
        map={(book) => (
          <TableRow key={book.id}>
            <TableCell className='font-medium sm:text-base'>{book.bookTitle}</TableCell>
            <TableCell>{format(book.updatedAt, 'dd / MM / yy')}</TableCell>
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
            <TableCell>
              <div className='flex items-center gap-2'>
                <Link href={`/books/read/${book.id}`}>
                  <Eye className='h-5 w-5 scale-95 cursor-pointer text-default-400 active:opacity-50' />
                </Link>
                <Link href={`/books/write/${book.clerkId}/${book.id}`}>
                  <PencilLine className='h-5 w-5 scale-95 cursor-pointer text-default-400 active:opacity-50' />
                </Link>
                <Button
                  isLoading={isLoading && isDeleting === book.id}
                  isIconOnly
                  className='m-0 block min-w-min max-w-min gap-0 bg-transparent p-0'
                >
                  <AlertDialog
                    trigger={
                      <Trash2 className='h-5 w-5 scale-95 cursor-pointer text-danger active:opacity-50' />
                    }
                    headerContent='Are you are?'
                    bodyContent='This action cannot be undone. This will delete the book permanently.'
                    footerContent={
                      <Button
                        onClick={() => deleteBook({ bookId: book.id })}
                        color='danger'
                        className='font-medium'
                      >
                        Delete
                      </Button>
                    }
                  />
                </Button>
              </div>
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

export default WriteBooksTab;
