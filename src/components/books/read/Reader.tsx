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

export default Reader;
