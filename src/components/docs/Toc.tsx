import { allDocs } from '.contentlayer/generated';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeToc, { Options as opts } from 'rehype-toc';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

import Link from '../ui/Link';

type TocProps = {
  doc: string;
};

const Toc = ({ doc: title }: TocProps) => {
  const doc = allDocs.find((doc) => doc.url.toLowerCase() === title.toLowerCase());

  if (!doc) {
    return null;
  }

  return (
    <div className='prose prose-base relative hidden dark:prose-invert lg:block'>
      <div className='sticky top-20 max-w-full'>
        <h4 className='text-foreground-700'>On this page</h4>

        <MDXRemote
          source={doc.body.raw}
          options={{
            mdxOptions: {
              development: process.env.NODE_ENV === 'development',
              format: 'mdx',
              rehypePlugins: [
                rehypeSlug,
                [
                  rehypeAutolinkHeadings,
                  {
                    className: ['subheading-anchor'],
                    ariaLabel: 'Link to section',
                  },
                ],
                [
                  // @ts-ignore
                  rehypeToc,
                  {
                    headings: ['h2', 'h3'],
                  } satisfies opts,
                ],
              ],
            },
          }}
          components={{
            p: () => <></>,
            pre: () => <></>,
            h1: () => <></>,
            h4: () => <></>,
            h2: () => <></>,
            h3: () => <></>,
            h5: () => <></>,
            ul: () => <></>,
            a: (props) => (
              <Link color='primary' className='hover:underline' href={props.href ?? ''}>
                {props.children
                  ?.toString()
                  .replaceAll(new RegExp(['-', ':', ':-'].join('|'), 'g'), '')}
              </Link>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default Toc;
