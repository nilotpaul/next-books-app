import { Avatar } from '@nextui-org/avatar';
import { Button } from '@nextui-org/button';
import Image from '../ui/Image';
import { Skeleton } from '@nextui-org/skeleton';

const SearchResultSkeleton = () => {
  return (
    <>
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <Button
            key={index}
            radius='sm'
            className='min-h-[4rem] w-full justify-between bg-default-50 pl-4 text-foreground-500 hover:bg-default/60 hover:text-white'
          >
            <div className='flex items-center gap-4'>
              <Image
                as={Avatar}
                src=''
                alt='Loading'
                radius='none'
                isLoading
                className='h-14 w-14'
                classNames={{ wrapper: 'rounded' }}
              />

              <p className='text-md truncate font-medium md:text-lg'>
                <Skeleton className='h-4 w-56 rounded' />
              </p>
            </div>
            <Skeleton className='h-6 w-12 rounded-full' />
          </Button>
        ))}
    </>
  );
};

export default SearchResultSkeleton;
