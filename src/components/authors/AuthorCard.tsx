import { AuthorByStars } from '@/types/author.types';

import { Card, CardBody, CardFooter } from '@nextui-org/card';
import Image from '../ui/Image';
import { Chip } from '@nextui-org/chip';

type AuthorCardProps = {
  authors: AuthorByStars[];
};

const AuthorCard = ({ authors }: AuthorCardProps) => {
  return (
    <div className='relative grid grid-cols-2 place-items-center gap-x-4 gap-y-4 xs:grid-cols-3 sm:grid-cols-3  sm:gap-x-2 md:grid-cols-4 md:place-items-start md:gap-x-4 md:gap-y-4 xl:grid-cols-5'>
      {authors.length !== 0 ? (
        <>
          {Array(10)
            .fill(authors[0])
            .map((author) => (
              <Card
                key={author.id}
                // as={Link}
                // href={`/books/${author.id}`}
                shadow='sm'
                radius='sm'
                isPressable
                className='h-[220px] w-[160px] sm:h-[250px] sm:w-[180px]'
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
                    alt={author.authorName}
                    className='h-full w-full object-cover'
                    src={author.authorImage || ''}
                  />
                </CardBody>
                <CardFooter className='flex justify-between gap-4 text-sm'>
                  <p className='line-clamp-2 text-start font-bold'>{author.authorName}</p>
                  <Chip
                    color='danger'
                    variant='flat'
                    className='hidden min-w-[40px] truncate p-0 text-xs md:flex'
                  >
                    <span className='font-medium'>Stars:</span> {author.stars}
                  </Chip>
                </CardFooter>
              </Card>
            ))}
        </>
      ) : (
        <p className='absolute left-1/2 -translate-x-1/2 text-foreground-700'>No Authors found.</p>
      )}
    </div>
  );
};

export default AuthorCard;
