import Blocks from 'editorjs-blocks-react-renderer';

import { HeaderRenderer, ImageRenderer, ListRenderer } from '@/components/CustomRenderers';

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
              'first-of-type:first-letter:text-3xl mt-3 first-of-type:first-letter:font-bold text-base leading-8',
          },
          header: {
            classNames: {
              h2: 'line-clamp-3',
            },
          },
        }}
        renderers={{
          image: ImageRenderer,
          list: ListRenderer,
          header: ({
            ...props
          }: {
            data: any;
            className?: string;
            classNames?: {
              h1?: string;
              h2?: string;
              h3?: string;
              h4?: string;
            };
          }) => HeaderRenderer(props),
        }}
      />
    </div>
  );
};

export default Reader;
