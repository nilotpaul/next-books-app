import Image from '@/components/ui/Image';
import { Button } from '@nextui-org/button';
import { ArrowLeft, ArrowRight, BookCopy } from 'lucide-react';

const ReaderSkeleton = () => {
  return (
    <div className='relative flex h-full w-full justify-center'>
      <Button isIconOnly className='absolute left-0 top-1/2 ml-8 hidden md:flex'>
        <ArrowLeft />
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

      <Button isIconOnly className='absolute right-0 top-1/2 mr-8 hidden md:flex'>
        <ArrowRight />
      </Button>
    </div>
  );
};

export default ReaderSkeleton;
