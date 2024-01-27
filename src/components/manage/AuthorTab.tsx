import { Author, SocialLinks } from '@/types/author.types';

import PendingAuthorRegisterModal from '../modals/PendingAuthorRegisterModal';
import AuthorRegisterModal from '../modals/AuthorRegisterModal';
import Image from '../ui/Image';
import { Card, CardBody, CardHeader, CardFooter } from '@nextui-org/card';
import { Input, Textarea } from '@nextui-org/input';
import { Chip } from '@nextui-org/chip';
import { Button } from '@nextui-org/button';
import { cn } from '@/utils/utils';
import AuthorProfileUpdateModal from '../modals/AuthorProfileUpdateModal';
import Heading from '../Heading';

type AuthorTabtProps = {
  isAuthor: boolean;
  author: Author | null;
  links: SocialLinks | null;
};

const AuthorTab = ({ isAuthor, author, links }: AuthorTabtProps) => {
  return (
    <>
      {!isAuthor && !author?.secretKey && <AuthorRegisterModal />}
      {!isAuthor && author?.secretKey && <PendingAuthorRegisterModal />}
      <div
        className={cn('h-full w-full space-y-2', {
          'bg-foreground-50 opacity-40 blur-md filter': !isAuthor,
        })}
      >
        <>
          <Card
            fullWidth
            className='space-y-2 border-1 border-stone-200 shadow-sm dark:border-0'
            classNames={{
              base: 'dark:bg-stone-800/50',
            }}
          >
            <CardHeader className='pb-1'>
              <Heading
                classNames={{
                  heading: 'font-semibold md:text-lg xs:text-lg underline dark:no-underline',
                  divider: 'hidden dark:block',
                }}
              >
                Author Profile
              </Heading>
            </CardHeader>

            <CardBody className='py-2 pl-0 sm:pl-3'>
              <div className='flex flex-col items-center justify-center space-x-3 sm:flex-row sm:justify-start'>
                <Image
                  src={author?.author_image || ''}
                  alt={author?.authorName || ''}
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
                  className='object-cover'
                />

                <div className='flex w-full flex-col items-center gap-y-1 space-y-2 sm:block'>
                  <Chip
                    size='sm'
                    className='mt-3 text-sm font-bold sm:mt-0'
                    color='primary'
                    variant='flat'
                  >
                    Stars: {author?.stars || 0}
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
                    value={author?.authorName}
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
                    value={author?.confirm_email}
                  />
                </div>
              </div>

              <CardFooter className='flex w-full items-center justify-end gap-3 pl-1.5 sm:px-0'>
                <AuthorProfileUpdateModal
                  type='Author Profile'
                  authorImage={author?.author_image || undefined}
                  authorName={author?.authorName}
                  bio={author?.bio}
                  genres={author?.artistGenres}
                  links={{
                    instagram: links?.instagram || undefined,
                    twitter: links?.twitter || undefined,
                  }}
                >
                  Edit Profile
                </AuthorProfileUpdateModal>

                <Button size='sm' color='danger'>
                  Delete
                </Button>
              </CardFooter>
            </CardBody>
          </Card>

          <Card
            fullWidth
            className='space-y-2 border-1 border-stone-200 shadow-sm dark:border-0'
            classNames={{
              base: 'dark:bg-stone-800/50',
            }}
          >
            <CardHeader className='pb-1'>
              <Heading
                classNames={{
                  heading: 'font-semibold md:text-lg xs:text-lg underline dark:no-underline',
                  divider: 'hidden dark:block',
                }}
              >
                Social Links
              </Heading>
            </CardHeader>

            <CardBody className='py-2 sm:pl-3'>
              <div className='flex w-full flex-col items-center justify-center gap-2'>
                <Textarea
                  readOnly
                  label='Author Bio'
                  placeholder='Enter your bio'
                  value={author?.bio}
                />

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
                <AuthorProfileUpdateModal
                  type='Social Links'
                  authorImage={author?.author_image || undefined}
                  authorName={author?.authorName}
                  bio={author?.bio}
                  genres={author?.artistGenres}
                  links={{
                    instagram: links?.instagram || undefined,
                    twitter: links?.twitter || undefined,
                  }}
                >
                  Edit
                </AuthorProfileUpdateModal>
              </CardFooter>
            </CardBody>
          </Card>
        </>
      </div>
    </>
  );
};

export default AuthorTab;
