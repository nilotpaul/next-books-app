import Blocks from 'editorjs-blocks-react-renderer';

import Image from '@/components/ui/Image';

type ReaderProps = {
  content: any;
};

const Reader = ({ content }: ReaderProps) => {
  return (
    <Blocks
      data={{
        blocks: [...content],
        time: 0,
        version: '',
      }}
      config={{
        header: {
          className: 'text-2xl font-bold',
        },
        paragraph: {
          className: 'text-base',
        },
      }}
      renderers={{
        image: ImageRenderer,
        // custom: Test,
      }}
    />
  );
};

const ImageRenderer = ({
  data,
}: {
  data: {
    file: { url: string; height: number; width: number };
    caption: string;
  } & Record<string, any>;
  className?: string;
}) => {
  return (
    <div className='my-4 flex max-h-[600px] min-w-[150px] flex-col justify-center gap-2 rounded-lg bg-default/30 p-1.5'>
      <Image
        classNames={{
          blurredImg: 'scale-[1] rounded-lg',
          img: 'rounded-lg',
        }}
        className='max-h-[600px] min-w-[150px]'
        src={data.file.url}
        alt={data.caption}
        height={data.file.height}
        width={data.file.width}
        quality={100}
        isBlurred
      />
      <span className='truncate text-sm font-medium italic text-foreground-700'>
        {data.caption}
      </span>
    </div>
  );
};

export default Reader;
