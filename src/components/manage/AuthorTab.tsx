import { Author, SocialLinks } from '@/types/author.types';
import { cn } from '@/utils/utils';

import PendingAuthorRegisterModal from '../modals/PendingAuthorRegisterModal';
import AuthorRegisterModal from '../modals/AuthorRegisterModal';
import Divider from '../ui/Divider';
import Image from '../ui/Image';
import { Card, CardBody, CardHeader, CardFooter } from '@nextui-org/card';
import { Input, Textarea } from '@nextui-org/input';
import { Chip } from '@nextui-org/chip';
import { Button } from '@nextui-org/button';

type AuthorTabtProps = {
  isAuthor: boolean;
  author: Author | null;
  links: SocialLinks | null;
};

const AuthorTab = ({ isAuthor, author, links }: AuthorTabtProps) => {
  const { author_image: image, authorName, stars, confirm_email: email, bio } = author!;

  return (
    <>
      {!isAuthor && !author?.secretKey && <AuthorRegisterModal />}
      {!isAuthor && author?.secretKey && <PendingAuthorRegisterModal />}
      <div
        className={cn('h-full w-full space-y-2', {
          'bg-foreground-50 opacity-40 blur-md filter': !isAuthor,
        })}
      >
        <Card
          fullWidth
          className='space-y-2'
          classNames={{
            base: 'bg-stone-800/50',
          }}
        >
          <CardHeader className='flex w-[150px] flex-col items-start pb-1 text-lg font-semibold text-foreground-600'>
            Author Profile <Divider className='w-[150px]' />
          </CardHeader>

          <CardBody className='py-2 pl-0 sm:pl-3'>
            <div className='flex flex-col items-center justify-center space-x-3 sm:flex-row sm:justify-start'>
              <Image
                src={image!}
                alt={authorName}
                aria-label='Reader image'
                isBlurred
                priority
                loading='eager'
                radius='full'
                fill
                classNames={{
                  wrapper: 'relative min-h-[150px] min-w-[150px] rounded-full',
                  blurredImg: 'scale-[0.9]',
                }}
              />

              <div className='flex w-full flex-col items-center gap-y-1 space-y-2 sm:block'>
                <Chip
                  size='sm'
                  className='mt-3 text-sm font-bold sm:mt-0'
                  color='primary'
                  variant='flat'
                >
                  Stars: {stars}
                </Chip>

                <Input
                  type='text'
                  label='Name'
                  readOnly
                  variant='faded'
                  size='sm'
                  classNames={{
                    inputWrapper: 'border-none',
                  }}
                  className='w-full sm:w-1/2'
                  value={authorName}
                />
                <Input
                  type='email'
                  label='Email'
                  readOnly
                  variant='faded'
                  size='sm'
                  classNames={{
                    inputWrapper: 'border-none',
                  }}
                  className='w-full sm:w-1/2'
                  value={email}
                />
              </div>
            </div>

            <CardFooter className='flex w-full items-center justify-end gap-3 pl-1.5 sm:px-0'>
              <Button size='sm' variant='bordered' color='primary'>
                Edit Profile
              </Button>
              <Button size='sm' color='danger'>
                Delete
              </Button>
            </CardFooter>
          </CardBody>
        </Card>

        <Card
          fullWidth
          className='space-y-2'
          classNames={{
            base: 'bg-stone-800/50',
          }}
        >
          <CardHeader className='flex w-[150px] flex-col items-start pb-1 text-lg font-semibold text-foreground-600'>
            Links and bio <Divider className='w-[150px]' />
          </CardHeader>

          <CardBody className='py-2 pl-0 sm:pl-3'>
            <div className='flex w-full flex-col items-center justify-center gap-2'>
              <Textarea readOnly label='Author Bio' placeholder='Enter your bio' value={bio} />

              <Input
                type='text'
                readOnly
                variant='faded'
                size='sm'
                classNames={{
                  inputWrapper: 'border-none',
                }}
                label='Instagram'
                placeholder='Enter your instagram link'
                value={links?.instagram || 'Not added'}
              />
              <Input
                type='text'
                readOnly
                variant='faded'
                size='sm'
                classNames={{
                  inputWrapper: 'border-none',
                }}
                label='Twitter'
                placeholder='Enter your twitter link'
                value={links?.twitter || 'Not added'}
              />
              <Input
                type='text'
                label='Name'
                readOnly
                variant='faded'
                size='sm'
                classNames={{
                  inputWrapper: 'border-none',
                }}
                placeholder='Enter any social other link'
                value={links?.other || 'Not added'}
              />
            </div>

            <CardFooter className='flex w-full items-center justify-end gap-3 pl-1.5 sm:px-0'>
              <Button size='sm' variant='bordered' color='primary'>
                Edit
              </Button>
            </CardFooter>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default AuthorTab;
