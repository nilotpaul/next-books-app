import { allDocs } from '.contentlayer/generated';
import { notFound } from 'next/navigation';

import MDXRenderer from '@/components/docs/MDXRenderer';

type pageProps = {
  params: {
    doc: string;
  };
};

const page = async ({ params }: pageProps) => {
  const { doc: title } = params;

  const doc = allDocs.find((doc) => doc.url.toLowerCase() === title.toLowerCase());

  if (!doc || !doc._id) {
    return notFound();
  }

  return <MDXRenderer content={doc.body.raw} />;
};

export default page;
