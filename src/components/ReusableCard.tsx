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
      href={href}
      shadow='sm'
      radius='sm'
      isPressable
      className='relative h-[200px]  md:h-[250px]'
    >
      <CardBody className='overflow-visible p-0'>
        <Image
          shadow='sm'
          isBlurred
          radius='none'
          fill
          alt={title}
          classNames={{
            wrapper: 'static',
          }}
          className='h-full w-full object-cover'
          src={thumbnail}
        />
      </CardBody>
      <CardFooter className='flex justify-between gap-4 text-sm'>
        <p className='line-clamp-2 text-start text-xs font-bold'>{title}</p>
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
        'relative grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3 md:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] md:gap-5',
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
