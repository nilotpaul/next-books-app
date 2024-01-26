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
      className='relative h-[200px] md:h-[250px]'
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
          className='absolute right-2 top-2 hidden min-w-[40px] truncate p-0 text-xs font-medium xs:static sm:flex'
        >
          {chip}
        </Chip>
      </CardFooter>
    </Card>
  );
};

export function GridContainer({
  children,
  className,
  position,
}: {
  children: React.ReactNode;
  className?: string;
  position?: 'start' | 'center';
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3 md:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] md:gap-5',
        {
          'grid-cols-[repeat(auto-fit,minmax(120px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]':
            position === 'center',
        },
        className
      )}
    >
      {children}
    </div>
  );
}

export default ReusableCard;
