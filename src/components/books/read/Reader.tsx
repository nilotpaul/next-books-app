import Blocks from 'editorjs-blocks-react-renderer';
import { lato, roboto } from '@/config/fonts';

import { HeaderRenderer, ImageRenderer, ListRenderer } from '@/components/CustomRenderers';
import { cn } from '@/utils/utils';

type ReaderProps = {
  content: any;
  illustration: boolean;
};

const Reader = ({ content, illustration }: ReaderProps) => {
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
            className: cn(
              'first-of-type:first-letter:text-3xl tracking-normal mt-3 first-of-type:first-letter:font-bold text-base leading-8',
              lato.className
            ),
          },
          header: {
            classNames: {
              h1: cn('line-clamp-3', roboto.className),
              h2: cn('line-clamp-3', roboto.className),
            },
          },
        }}
        renderers={{
          image: (props) => ImageRenderer({ ...props, data: { ...props.data, illustration } }),
          list: ListRenderer,
          header: (props: {
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
