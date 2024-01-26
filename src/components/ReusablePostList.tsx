import Blocks from 'editorjs-blocks-react-renderer';
import { format } from 'date-fns';

import { HeaderRenderer, ImageRenderer, LinkRenderer, ListRenderer } from './CustomRenderers';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { ScrollShadow } from '@nextui-org/scroll-shadow';
import { Dot } from 'lucide-react';
import Divider from './ui/Divider';
import Image from '@/components/ui/Image';

type ForumPostWrapperProps = {
  data: {
    id: string;
    title: string;
    thumbnail?: string | null;
    date: Date;
  };
  content: any;
  lastItem: boolean;
  topRightElement?: JSX.Element;
};

const ResuablePostList = ({ data, content, topRightElement, lastItem }: ForumPostWrapperProps) => {
  const { id, title, thumbnail, date } = data;

  return (
    <>
      <ScrollShadow visibility='bottom' size={30} className='h-full'>
        <Card
          key={id}
          radius='sm'
          isBlurred
          classNames={{
            base: 'shadow-xl',
          }}
          className='max-h-[30rem] min-h-[12rem] w-full border-1 text-foreground-600 outline-none dark:border-0 dark:bg-foreground-50/60 dark:transition-all dark:duration-1000 dark:hover:opacity-90 md:w-3/4'
        >
          <CardHeader className='flex h-full w-full items-start justify-between gap-4 text-foreground-800 md:items-center'>
            <div className='line-clamp-2 flex flex-col gap-1.5 md:flex-row md:items-center md:gap-0'>
              <p
                id={title.replaceAll(' ', '').toLowerCase()}
                className='text-lg font-semibold md:text-xl'
              >
                {title}
              </p>
              <Dot className='hidden md:block' />
              <p className='text-xs italic text-foreground-600'>
                {format(date, 'do, MMM yy (hh:mm)')}
              </p>
            </div>

            <span className='mt-1 md:mt-0'>{topRightElement}</span>
          </CardHeader>

          <CardBody
            // href={`forum/post/${id}`} maybe i'll add a dedicated post page
            className='h-full w-full cursor-auto overflow-y-auto scrollbar-hide'
          >
            {thumbnail && (
              <Image
                src={thumbnail}
                alt={title}
                fill
                isBlurred
                radius='sm'
                classNames={{
                  wrapper: 'relative min-h-[350px] md:min-h-[450px] min-w-full',
                  blurredImg: 'scale-95 rounded-md',
                }}
                className='h-full w-full object-cover'
              />
            )}

            <Blocks
              data={{
                blocks: content,
                time: 0,
                version: '',
              }}
              config={{
                paragraph: {
                  className: 'mt-3 text-base leading-6',
                },
                image: {
                  className: 'mt-0',
                },
              }}
              renderers={{
                image: ImageRenderer,
                list: ListRenderer,
                header: HeaderRenderer,
                linkTool: LinkRenderer,
              }}
            />
          </CardBody>
        </Card>
      </ScrollShadow>

      {!lastItem && (
        <Divider className='my-3 h-[0.5px] w-full rounded-full bg-foreground-100 md:my-8 md:w-3/4' />
      )}
    </>
  );
};

export default ResuablePostList;
