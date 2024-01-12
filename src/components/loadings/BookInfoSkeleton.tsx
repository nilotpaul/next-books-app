import { Skeleton } from '@nextui-org/skeleton';
import BookInfoLeft from '../books/main/BookInfoLeft';

const BookInfoSkeleton = () => {
  return (
    <div className='grid h-full w-full place-content-between place-items-start gap-12 md:grid-cols-2'>
      <div className='relative w-[530px]'>
        <BookInfoLeft isLoading backArtwork='' frontArtwork='' title='' />
      </div>

      <div className='w-full space-y-6'>
        <Skeleton className='h-8 w-[80%] rounded-lg' />
        <Skeleton className='h-4 w-1/2 rounded-lg' />

        <div className='space-y-2 pt-4'>
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} className='h-2 w-full rounded-full' />
            ))}
        </div>
      </div>
    </div>
  );
};

export default BookInfoSkeleton;
