import { Button } from '@nextui-org/button';
import Divider from '../ui/Divider';
import { Skeleton } from '@nextui-org/skeleton';
import { Plus } from 'lucide-react';
import Image from '../ui/Image';

const WriteBooksTabSkeleton = () => {
  return (
    <div className='flex flex-col items-end justify-center gap-y-1.5 pb-3'>
      <div className='flex w-full items-center justify-between'>
        <Image src='' alt='Loading' width={30} height={30} isLoading className='rounded-full' />

        <Button
          variant='solid'
          color='success'
          size='sm'
          startContent={<Plus className='h-4 w-4 font-extrabold' />}
          className='gap-1.5 text-small font-semibold text-black'
        >
          Write Book
        </Button>
      </div>

      <Divider className='h-[1px] rounded-md bg-default' />

      <Skeleton className='mt-2 h-36 w-full rounded-lg' />
    </div>
  );
};

export default WriteBooksTabSkeleton;
