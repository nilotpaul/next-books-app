import { PublishedBook } from '@/types/book.types';
import { getPublishedBooks } from '@/services/books.services';

import Image from '@/components/ui/Image';
import { Card, CardBody, CardFooter } from '@nextui-org/card';
import { Chip } from '@nextui-org/chip';
import Link from '@/components/ui/Link';
import wait from '@/lib/wait';

type BookCardProps = {};

const BookCard = async ({}: BookCardProps) => {
  const books = await getPublishedBooks();

  return (
    <div className='xs:grid-cols-3 grid grid-cols-2 place-items-center gap-x-4 gap-y-4 sm:grid-cols-3  sm:gap-x-2 md:grid-cols-4 md:place-items-start md:gap-x-4 md:gap-y-4 xl:grid-cols-5'>
      {books.map((book) => (
        <Card
          as={Link}
          href={`/books/read/${book.id}`}
          shadow='sm'
          radius='sm'
          key={book.id}
          isPressable
          className='relative h-[220px] w-[160px] sm:h-[250px] sm:w-[180px]'
        >
          <CardBody className='w-full overflow-visible p-0'>
            <Image
              shadow='sm'
              isBlurred
              radius='none'
              fill
              classNames={{
                wrapper: 'static',
              }}
              alt={book.title}
              className='h-full w-full object-cover'
              src={book.artwork! || ''}
            />
          </CardBody>
          <CardFooter className='flex justify-between gap-4 text-sm'>
            <p className='line-clamp-2 text-start font-bold'>{book.title}</p>
            <Chip
              color='danger'
              variant='flat'
              className='xs:static absolute right-2 top-2 min-w-[40px] truncate p-0 text-xs'
            >
              {/* {book.availability === 'Free' ? book.availability : book.price} */}
              Free
            </Chip>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default BookCard;
