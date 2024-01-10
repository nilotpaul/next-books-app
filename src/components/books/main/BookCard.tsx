import Image from '@/components/ui/Image';
import { Card, CardBody, CardFooter } from '@nextui-org/card';
import { Chip } from '@nextui-org/chip';
import Link from '@/components/ui/Link';
import { MAX_SEARCH_RESULTS_LIMIT } from '@/config/constants/search-filters';

type Book = {
  id: string;
  title: string;
  availability: 'Free' | 'Paid' | null;
  artwork: string | null;
  price: string | null;
};

type BookCardProps = {
  books: Book[];
  mantineRef?: (element: any) => void;
};

const BookCard = ({ books, mantineRef }: BookCardProps) => {
  return (
    <div className='relative grid grid-cols-2 place-items-center gap-x-4 gap-y-4 xs:grid-cols-3 sm:grid-cols-3  sm:gap-x-2 md:grid-cols-4 md:place-items-start md:gap-x-4 md:gap-y-4 xl:grid-cols-5'>
      {books.length !== 0 ? (
        <>
          {books.map((book, index) => {
            const lastIndex = books.findIndex((item) => item.id === books[books.length - 1].id);

            return (
              <div key={book.id} ref={lastIndex === index ? mantineRef : undefined}>
                <Card
                  as={Link}
                  href={`/books/read/${book.id}`}
                  shadow='sm'
                  radius='sm'
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
                      className='absolute right-2 top-2 min-w-[40px] truncate p-0 text-xs xs:static'
                    >
                      {/* {book.availability === 'Free' ? book.availability : book.price} */}
                      Free
                    </Chip>
                  </CardFooter>
                </Card>
              </div>
            );
          })}
        </>
      ) : (
        <p className='absolute left-1/2 -translate-x-1/2 text-foreground-700'>No books found.</p>
      )}
    </div>
  );
};

export default BookCard;
