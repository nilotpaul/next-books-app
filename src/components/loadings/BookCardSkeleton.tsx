import { Card, CardBody, CardFooter } from '@nextui-org/card';
import Image from '../ui/Image';
import { Skeleton } from '../ui/Skeleton';

type BookCardSkeletonProps = {
  cards?: number;
};

const BookCardSkeleton = ({ cards = 8 }: BookCardSkeletonProps) => {
  return (
    <div className='grid grid-cols-2 place-items-center gap-y-4 xs:grid-cols-3 sm:grid-cols-3 sm:gap-x-2 md:grid-cols-4 md:place-items-start md:gap-x-4 md:gap-y-4 xl:grid-cols-5'>
      {Array(cards)
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
                classNames={{
                  wrapper: 'static',
                }}
                alt='Loading'
                className='h-full w-full object-cover'
                src=''
              />
            </CardBody>
            <CardFooter className='flex justify-between gap-4 text-sm'>
              <div className='space-y-1'>
                <Skeleton className='h-2 w-20' />
                <Skeleton className='h-2 w-12' />
              </div>
              <Skeleton className='h-4 w-8 rounded-lg' />
            </CardFooter>
          </Card>
        ))}
    </div>
  );
};

export default BookCardSkeleton;
