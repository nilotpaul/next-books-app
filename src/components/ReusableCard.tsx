import Image from '@/components/ui/Image';
import { Card, CardBody, CardFooter } from '@nextui-org/card';
import { Chip } from '@nextui-org/chip';
import Link from '@/components/ui/Link';
import { cn } from '@/utils/utils';

type Data = {
  id: string;
  title: string;
  thumbnail: string;
  chip: string;
  href: string;
};

type ReusableCardProps = {
  data: Data;
};

const ReusableCard = ({ data }: ReusableCardProps) => {
  const { id, title, href, thumbnail, chip } = data;

  return (
    <Card
      key={id}
      as={Link}
      href={`${href}`}
      shadow='sm'
      radius='sm'
      isPressable
      className='relative h-[220px] w-[160px] sm:h-[250px] sm:w-[180px]'
    >
      <CardBody className='w-full overflow-visible p-0'>
        <Image
          shadow='sm'
          isBlurred
          radius='none'
          fill
          classNames={{
            wrapper: 'static',
          }}
          alt={title}
          className='h-full w-full object-cover'
          src={thumbnail}
        />
      </CardBody>
      <CardFooter className='flex justify-between gap-4 text-sm'>
        <p className='line-clamp-2 text-start font-bold'>{title}</p>
        <Chip
          color='danger'
          variant='flat'
          className='absolute right-2 top-2 min-w-[40px] truncate p-0 text-xs font-medium xs:static'
        >
          {chip}
        </Chip>
      </CardFooter>
    </Card>
  );
};

export function GridContainer({
  children,
  notFound,
  classNames,
}: {
  children: React.ReactNode;
  notFound?: boolean;
  classNames?: {
    main?: string;
    notFound?: string;
  };
}) {
  return (
    <div
      className={cn(
        'relative grid grid-cols-2 place-items-center gap-x-4 gap-y-4 xs:grid-cols-3 sm:grid-cols-3 sm:gap-x-2 md:grid-cols-4 md:place-items-start md:gap-x-4 md:gap-y-4 xl:grid-cols-5',
        classNames?.main
      )}
    >
      {!notFound ? (
        children
      ) : (
        <p
          className={cn(
            'absolute left-1/2 -translate-x-1/2 text-foreground-600',
            classNames?.notFound
          )}
        >
          No books found.
        </p>
      )}
    </div>
  );
}

export default ReusableCard;
