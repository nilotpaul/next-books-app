import { cn } from '@/utils/utils';
import Image from './ui/Image';
import Divider from './ui/Divider';

export const HeaderRenderer = ({
  data,
}: {
  data: { text: string; level: number };
  className?: string;
}) => {
  if (data.level === 1) {
    return (
      <h1 id={data.text.toLowerCase().trim()} className='text-xl font-bold md:text-2xl'>
        {data.text.replace(/&nbsp;/g, ' ')}
      </h1>
    );
  } else if (data.level === 2) {
    return (
      <h2 id={data.text.trim().toLowerCase()} className='text-xl font-bold md:text-2xl'>
        {data.text.replace(/&nbsp;/g, ' ')}
      </h2>
    );
  } else if (data.level === 3) {
    return <h3>{data.text.replace(/&nbsp;/g, ' ')}</h3>;
  } else if (data.level === 4) {
    return <h4>{data.text.replace(/&nbsp;/g, ' ')}</h4>;
  }

  return <></>;
};

export const ImageRenderer = ({
  data,
  className,
}: {
  data: {
    file: { url: string; height: number; width: number; title?: string; author?: string };
    caption: string;
  };
  className?: string;
}) => {
  const isCover =
    data.file.width === 1800 && data.file.height === 2700 && data.file.title?.length !== 0;

  return (
    <div
      className={cn(
        'relative my-4 flex max-h-[700px] min-w-[350px] flex-col justify-center gap-2 rounded-lg bg-default/30 p-1.5',
        {
          'mx-auto mt-3 p-0 md:w-[630px]': isCover,
        },
        className
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

export const ListRenderer = ({
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
