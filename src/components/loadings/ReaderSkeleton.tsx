import { Button } from '@nextui-org/button';
import { Skeleton } from '@nextui-org/skeleton';
import { ArrowLeftIcon, ArrowRightIcon, BookCopy } from 'lucide-react';

const ReaderSkeleton = () => {
  return (
    <div className='relative flex h-full w-full justify-center md:items-center'>
      <Button
        isIconOnly
        variant='bordered'
        color='danger'
        className='absolute left-8 top-1/2 hidden rounded-full md:flex'
      >
        <ArrowLeftIcon className='h-4 w-4' />
      </Button>

      <div className='relative flex h-full max-h-[700px] w-full justify-center md:items-center'>
        <Skeleton className='mt-3 h-full w-full rounded-lg md:w-[600px] md:pt-0' />

        <BookCopy className='absolute top-1/2 h-10 w-10 -translate-y-1/2 animate-ping text-danger' />
      </div>

      <Button
        isIconOnly
        variant='bordered'
        color='danger'
        className='absolute right-8 top-1/2 hidden rounded-full md:flex'
      >
        <ArrowRightIcon className='h-4 w-4' />
      </Button>
    </div>
  );
};

export default ReaderSkeleton;
