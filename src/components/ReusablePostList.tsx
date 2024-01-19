import Blocks from 'editorjs-blocks-react-renderer';
import { format } from 'date-fns';

import { HeaderRenderer, ImageRenderer, ListRenderer } from './CustomRenderers';
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
          className='max-h-[30rem] min-h-[12rem] w-3/4 border-0 text-foreground-600 outline-none dark:bg-foreground-50/60 dark:transition-all dark:duration-1000 dark:hover:opacity-90'
        >
          <CardHeader className='flex h-full w-full items-center justify-between gap-4 truncate text-foreground-800'>
            <div className='flex items-center'>
              <p
                id={title.replaceAll(' ', '').toLowerCase()}
                className='text-lg font-semibold md:text-xl'
              >
                {title}
              </p>
              <Dot />
              <p className='text-xs italic'>{format(date, 'do, MMM yy (hh:mm)')}</p>
            </div>

            {topRightElement}
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
                  wrapper: 'min-h-[450px] min-w-full',
                  blurredImg: 'scale-95 rounded-md',
                }}
                className='h-full w-full'
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
              }}
            />
          </CardBody>
        </Card>
      </ScrollShadow>

      {!lastItem && <Divider className='my-8 h-[0.5px] w-3/4 rounded-full bg-foreground-100' />}
    </>
  );
};

export default ResuablePostList;
