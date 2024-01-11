import { PublishedBook } from '@/types/book.types';

import { Avatar } from '@nextui-org/avatar';
import { Button } from '@nextui-org/button';
import { Chip } from '@nextui-org/chip';

type SearchedResultsProps = {
  book: PublishedBook;
  ref?: (element: any) => void;
};

const SearchedResults = ({ book, ref }: SearchedResultsProps) => {
  return (
    <div ref={ref}>
      <Button
        radius='sm'
        className='min-h-[4rem] w-full justify-between bg-default-50 pl-4 text-foreground-500 hover:bg-default/60 hover:text-white'
      >
        <div className='flex items-center gap-4'>
          <Avatar
            src={book.artwork!}
            name={book.title}
            radius='none'
            size='lg'
            className='rounded'
          />
          <p className='text-md truncate font-medium md:text-lg'>{book.title}</p>
        </div>
        <Chip variant='flat' color='danger'>
          {book.availability}
        </Chip>
      </Button>
    </div>
  );
};

export default SearchedResults;
