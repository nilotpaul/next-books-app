import { Card, CardBody, CardFooter } from '@nextui-org/card';
import Image from '../ui/Image';
import { Skeleton } from '@nextui-org/skeleton';

const AuthorCardSkeleton = () => {
  return (
    <>
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <Card
            key={index}
            shadow='sm'
            radius='sm'
            isPressable
            className='relative h-[220px] w-[160px] sm:h-[250px] sm:w-[180px]'
          >
            <CardBody className='w-full overflow-visible p-0'>
              <Image
                shadow='sm'
                isBlurred
                isLoading
                radius='none'
                fill
                alt=''
                src=''
                classNames={{
                  wrapper: 'static',
                }}
                className='h-full w-full object-cover'
              />
            </CardBody>
            <CardFooter className='flex justify-between gap-4 text-sm'>
              <p className='line-clamp-2 space-y-1 text-start font-bold'>
                <Skeleton className='h-2 w-24 rounded-full' />
                <Skeleton className='h-1.5 w-20 rounded-full' />
              </p>
            </CardFooter>
          </Card>
        ))}
    </>
  );
};

export default AuthorCardSkeleton;
