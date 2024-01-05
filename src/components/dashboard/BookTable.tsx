import { BooksWithoutNT } from '@/types/book.types';
import { format } from 'date-fns';
import { trpc } from '@/lib/trpc/TRPCProvider';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { bookTableColumns } from '@/config/constants/books';
import { Table, TableHeader, TableColumn, TableRow, TableBody, TableCell } from '@nextui-org/table';
import { Chip } from '@nextui-org/chip';
import { Eye, PencilLine, Trash2 } from 'lucide-react';
import Link from '../ui/Link';
import { Button } from '@nextui-org/button';

type BookTableProps = {
  books: (BooksWithoutNT[number] & { authorImage: string | null })[];
  type: string;
};

const BookTable = ({ books, type }: BookTableProps) => {
  const router = useRouter();
  const { mutate: deleteBook, isLoading } = trpc.bookRouter.delete.useMutation({
    onSuccess: () => {
      router.refresh();
      toast.success('Successfully deleted the book');
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });

  return (
    <Table aria-label={type}>
      <TableHeader>
        {bookTableColumns.map((item) => (
          <TableColumn key={item} className='capitalize'>
            {item}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody emptyContent={`${type} is empty!`}>
        {books.map((book) => (
          <TableRow key={book.id}>
            <TableCell className='text-base'>{book.bookTitle}</TableCell>
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
              <span className='flex items-center gap-2'>
                <Link href={`/books/read/${book.id}`}>
                  <Eye className='h-5 w-5 scale-95 cursor-pointer text-default-400 active:opacity-50' />
                </Link>
                <Link href={`/books/write/${book.clerkId}/${book.id}`}>
                  <PencilLine className='h-5 w-5 scale-95 cursor-pointer text-default-400 active:opacity-50' />
                </Link>
                <Button
                  onClick={() => {
                    // deleteBook({ bookId: book.id });
                  }}
                  disableAnimation
                  isLoading={isLoading}
                  isIconOnly
                  className='m-0 block min-w-min max-w-min gap-0 bg-transparent p-0'
                >
                  <Trash2 className='h-5 w-5 scale-95 cursor-pointer text-danger active:opacity-50' />
                </Button>
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BookTable;
