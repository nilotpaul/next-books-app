import { FullForumPost } from '@/types/forumPost.types';
import Blocks from 'editorjs-blocks-react-renderer';
import { format } from 'date-fns';

import { HeaderRenderer, ImageRenderer, ListRenderer } from '../CustomRenderers';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { ScrollShadow } from '@nextui-org/scroll-shadow';
import { Dot, ThumbsUp } from 'lucide-react';
import Divider from '../ui/Divider';
import Image from '@/components/ui/Image';
import Link from '../ui/Link';
import NextLink from 'next/link';
import { cn } from '@/utils/utils';

type ForumPostWrapperProps = {
  getPosts: () => Promise<FullForumPost[]>;
};

const ForumPostWrapper = async ({ getPosts }: ForumPostWrapperProps) => {
  const posts = await getPosts();

  return posts.map((post) => (
    <>
      <Card
        key={post.id}
        radius='sm'
        isBlurred
        className={cn(
          'max-h-[30rem] min-h-[12rem] w-3/4  border-0 text-foreground-600 outline-none dark:bg-foreground-50/60',
          {
            'dark:transition-all dark:duration-1000 dark:hover:opacity-80': !post.image,
          }
        )}
      >
        <ScrollShadow
          visibility={!post.image ? 'none' : undefined}
          hideScrollBar
          className='overflow-hidden'
        >
          <CardHeader className='flex h-full w-full flex-col items-start gap-4 text-foreground-800'>
            <div className='flex w-full items-center justify-between truncate'>
              <div className='flex items-center'>
                <p className='text-lg font-semibold md:text-xl'>{post.postTitle}</p>
                <Dot />
                <p className='text-xs italic'>{format(post.createdAt, 'do, MMM, yyyy')}</p>
              </div>

              <ThumbsUp className='h-4 w-4 cursor-pointer text-danger' />
            </div>

            {post.image && (
              <Link href={`forum/post/${post.id}`} className='h-full w-full'>
                <Image
                  src={post.image}
                  alt={post.postTitle}
                  fill
                  isBlurred
                  radius='sm'
                  classNames={{
                    wrapper: 'min-h-[450px] min-w-full',
                    blurredImg: 'scale-100 rounded-md',
                  }}
                  className='h-full w-full'
                />
              </Link>
            )}
          </CardHeader>
        </ScrollShadow>

        {!post.image && (
          <CardBody
            as={NextLink}
            href={`forum/post/${post.id}`}
            className='h-full w-full overflow-hidden'
          >
            <Blocks
              data={{
                blocks: post.content,
                time: 0,
                version: '',
              }}
              config={{
                paragraph: {
                  className: 'mt-3 text-base leading-6',
                },
              }}
              renderers={{
                image: ImageRenderer,
                list: ListRenderer,
                header: HeaderRenderer,
              }}
            />
          </CardBody>
        )}
      </Card>

      <Divider className='h-[0.5px] w-3/4 rounded-full bg-foreground-100' />
    </>
  ));
};

export default ForumPostWrapper;
