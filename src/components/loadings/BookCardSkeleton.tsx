import { Card, CardBody, CardFooter } from '@nextui-org/card';
import { Skeleton } from '@nextui-org/skeleton';

type BookCardSkeletonProps = {
  cards?: number;
};

const BookCardSkeleton = ({ cards = 8 }: BookCardSkeletonProps) => {
  return (
    <>
      {Array(cards)
        .fill(0)
        .map((_, index) => (
          <Card
            key={index}
            shadow='sm'
            radius='sm'
            isPressable
            className='relative h-[200px] max-w-[180px] md:h-[250px]'
          >
            <CardBody className='w-full overflow-visible p-0'>
              <Skeleton className='h-full w-full rounded-lg' />
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
    </>
  );
};

export default BookCardSkeleton;
