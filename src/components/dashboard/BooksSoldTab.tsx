import { useContext } from 'react';
import { MyDashboardContext } from '../context/DashboardContext';

import ReusableTable from '../ReusableTable';
import { TableRow, TableCell } from '@nextui-org/table';
import Image from '../ui/Image';
import { convertPrice } from '@/utils/utils';
import { Chip } from '@nextui-org/chip';

const BooksSoldTab = () => {
  const authorBooks = useContext(MyDashboardContext)?.authorBooks || [];
  const booksWithPurchaseCount = authorBooks.map((book) => ({
    bookId: book.id,
    title: book.bookTitle,
    image: book.frontArtwork,
    purchaseCount: book.purchaseCount || 0,
    price: Number(book.pricing) || 0,
    status: book.status,
  }));

  const menu = ['Title', 'Artwork', 'Status', 'Sold', 'Total $'];

  return (
    <ReusableTable
      type='Books Sold'
      columns={menu}
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
  );
};

export default BooksSoldTab;
