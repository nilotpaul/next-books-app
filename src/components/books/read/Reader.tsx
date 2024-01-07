import Blocks from 'editorjs-blocks-react-renderer';

import Image from '@/components/ui/Image';
import Divider from '@/components/ui/Divider';
import { cn } from '@/utils/utils';

type ReaderProps = {
  content: any;
};

const Reader = ({ content }: ReaderProps) => {
  return (
    <div className='mt-2 h-full prose-headings:text-foreground-600 prose-p:text-foreground-800'>
      <Blocks
        data={{
          blocks: content,
          time: 0,
          version: '',
        }}
        config={{
          paragraph: {
            className:
              'text-base first-of-type:first-letter:text-3xl mt-3 first-of-type:first-letter:font-bold text-base leading-8',
          },
        }}
        renderers={{
          image: ImageRenderer,
          list: ListRenderer,
          header: HeaderRenderer,
        }}
      />
    </div>
  );
};

const HeaderRenderer = ({
  data,
}: {
  data: { text: string; level: number };
  className?: string;
}) => {
  if (data.level === 1) {
    return (
      <h1 id={data.text.toLowerCase().trim()} className='text-xl font-bold md:text-2xl'>
        {data.text}
      </h1>
    );
  } else if (data.level === 2) {
    return (
      <h2 id={data.text.trim().toLowerCase()} className='text-xl font-bold md:text-2xl'>
        {data.text}
      </h2>
    );
  } else if (data.level === 3) {
    return <h3>{data.text}</h3>;
  } else if (data.level === 4) {
    return <h4>{data.text}</h4>;
  }

  return <></>;
};

const ImageRenderer = ({
  data,
}: {
  data: {
    file: { url: string; height: number; width: number; title?: string; author?: string };
    caption: string;
  };
}) => {
  const isCover =
    data.file.width === 1800 && data.file.height === 2700 && data.file.title?.length !== 0;

  return (
    <div
      className={cn(
        'relative my-4 flex max-h-[700px] min-w-[350px] flex-col justify-center gap-2 rounded-lg bg-default/30 p-1.5',
        {
          'mx-auto mt-3 p-0 md:w-[630px]': isCover,
        }
      )}
    >
      <Image
        classNames={{
          blurredImg: 'scale-[1] rounded-lg',
          img: 'rounded-lg',
          wrapper: 'rounded-lg',
        }}
        className={cn('z-10', { 'mx-auto max-h-[700px] md:w-[630px]': isCover })}
        src={data.file.url}
        alt={data.caption}
        height={data.file.height}
        width={data.file.width}
        quality={100}
        isBlurred
      />
      {data?.caption && (
        <span className='truncate text-sm font-medium italic text-foreground-700'>
          {data.caption}
        </span>
      )}
    </div>
  );
};

const ListRenderer = ({
  data,
}: {
  data: { items: any[]; style: 'ordered' | 'unordered'; name?: string; title?: string };
}) => {
  const isToc = Boolean(data?.name && data?.name === 'toc');

  if (isToc) {
    return (
      <div className='flex flex-col'>
        <h2 className='mt-3 text-2xl font-medium'>Table of Contents</h2>
        <Divider className='mb-4 w-1/3' />

        <ul className='mt-2 space-y-6'>
          {data.items.map((item, index) => (
            <ul key={index}>
              <p className='mb-1 text-lg font-medium'>Chapter {index + 1}</p>
              <a
                href={`#${item.trim().toLowerCase()}`}
                className='cursor-pointer text-base text-foreground-600 underline'
              >
                {item}
              </a>
            </ul>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <ul className='list-disc space-y-2'>
      {data.items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
};

export default Reader;
