import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode, { type Options } from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';

import Image from '../ui/Image';
import Link from '../ui/Link';

type MDXRendererProps = {
  content: string;
};

const MDXRenderer = ({ content }: MDXRendererProps) => {
  const options: Options = {
    theme: 'tokyo-night',
  };

  return (
    <div className='prose prose-sm max-w-full dark:prose-invert xs:prose-base sm:prose-sm md:prose-base prose-headings:mt-4 prose-headings:text-danger prose-h1:text-zinc-200 prose-h2:text-3xl prose-h3:text-xl prose-h3:font-semibold prose-a:text-primary prose-strong:font-bold prose-img:m-0'>
      <MDXRemote
        source={content}
        options={{
          mdxOptions: {
            development: process.env.NODE_ENV === 'development',
            format: 'mdx',
            remarkPlugins: [remarkGfm, remarkBreaks],
            rehypePlugins: [
              rehypeSlug,
              // @ts-ignore
              [rehypePrettyCode, options],
              [
                rehypeAutolinkHeadings,
                {
                  className: ['subheading-anchor'],
                  ariaLabel: 'Link to section',
                },
              ],
            ],
          },
        }}
        components={{
          img: (props) =>
            props.src?.length && (
              <Image
                src={props.src}
                alt={props.alt ?? 'Reference image'}
                isBlurred
                radius='lg'
                fill
                className='object-scale-down'
                classNames={{
                  wrapper:
                    'relative min-h-max my-3 md:my-8 max-h-[250px] md:max-h-[400px] min-w-full aspect-square',
                  blurredImg: 'object-scale-down',
                }}
              />
            ),
          p: (props) =>
            props.children === 'string' ? (
              <p className='space-y-12'>{props.children}</p>
            ) : (
              props.children
            ),
          a: (props) => (
            <Link color='primary' className='hover:underline' href={props.href ?? ''}>
              {props.children}
            </Link>
          ),
        }}
      />
    </div>
  );
};

export default MDXRenderer;
