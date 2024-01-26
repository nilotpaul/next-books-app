import { cn } from '@/utils/utils';
import Image from './ui/Image';
import Heading from './Heading';
import Link from './ui/Link';

export const HeaderRenderer = ({
  data,
  classNames,
}: {
  data: { text: string; level: number };
  classNames?: {
    h1?: string;
    h2?: string;
    h3?: string;
    h4?: string;
  };
}) => {
  if (data.level === 1) {
    return (
      <h1
        id={data.text.toLowerCase().trim()}
        className={cn('text-xl font-bold xs:text-2xl sm:text-xl md:text-2xl', classNames?.h1)}
      >
        {data.text.replace(/&nbsp;/g, ' ')}
      </h1>
    );
  } else if (data.level === 2) {
    return (
      <h2
        id={data.text.trim().toLowerCase()}
        className={cn('text-xl font-bold xs:text-2xl sm:text-xl md:text-2xl', classNames?.h2)}
      >
        {data.text.replace(/&nbsp;/g, ' ')}
      </h2>
    );
  } else if (data.level === 3) {
    return <h3 className={cn(classNames?.h3)}>{data.text.replace(/&nbsp;/g, ' ')}</h3>;
  } else if (data.level === 4) {
    return <h4 className={cn(classNames?.h4)}>{data.text.replace(/&nbsp;/g, ' ')}</h4>;
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
    data.file.width === 1600 && data.file.height === 2400 && data.file.title?.length !== 0;

  return (
    <div
      className={cn(
        'relative my-4 flex max-h-[700px] flex-col justify-center gap-2 rounded-lg bg-default/30 p-1.5 md:min-w-[350px]',
        {
          'mx-auto mt-3 p-0 md:w-[600px]': isCover,
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
        <Heading classNames={{ heading: 'font-semibold mb-2 text-xl xs:text-2xl' }}>
          Table of Contents
        </Heading>

        <ul className='mt-4 space-y-6'>
          {data.items.map((item, index) => (
            <ul key={index}>
              <p className='mb-1 text-lg font-medium'>Chapter {index + 1}</p>
              <a
                href={`#${item.trim().toLowerCase()}`}
                className='cursor-pointer border-b-1 text-base text-foreground-600'
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

export const LinkRenderer = ({
  data,
}: {
  data: {
    link: string;
    meta: {
      description?: string | null;
      image?: { url?: string | null };
      title: string;
    };
  };
  className?: string;
}) => {
  return (
    <Link
      href={data.link}
      target='_blank'
      className='mt-4 grid grid-cols-2 items-start gap-4 rounded-lg bg-primary-50 p-3 dark:bg-slate-900/80'
    >
      <div className='space-y-2'>
        <Heading
          classNames={{ divider: 'hidden', heading: 'font-semibold text-lg text-foreground-700' }}
        >
          {data.meta.title}
        </Heading>
        <p className='text-sm xs:text-base'>{data.meta.description}</p>
      </div>

      {data.meta.image?.url && (
        <img className='rounded-md' src={data.meta.image.url} alt={data.meta.title} />
      )}
    </Link>
  );
};
