import Image from '@/components/ui/Image';
import { Button } from '@nextui-org/button';
import { ArrowLeftIcon, ArrowRightIcon, BookCopy } from 'lucide-react';

const ReaderSkeleton = () => {
  return (
    <div className='relative flex h-full w-full items-center justify-center'>
      <Button
        isIconOnly
        variant='bordered'
        color='danger'
        className='absolute left-8 top-1/2 hidden rounded-full md:flex'
      >
        <ArrowLeftIcon className='h-4 w-4' />
      </Button>

      <div className='relative flex h-full items-center justify-center'>
        <Image
          src=''
          alt='Loading'
          isLoading
          classNames={{
            wrapper: 'h-full',
          }}
          className='h-full min-w-[630px] rounded-lg'
        />
        <BookCopy className='absolute h-10 w-10 animate-ping text-danger' />
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
