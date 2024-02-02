import { allDocs } from '.contentlayer/generated';
import { notFound } from 'next/navigation';
import nextDynamic from 'next/dynamic';
import { Suspense } from 'react';

const MDXRenderer = nextDynamic(() => import('@/components/docs/MDXRenderer'));

export const dynamicParams = false;
export const dynamic = 'force-static';

type pageProps = {
  params: {
    doc: string;
  };
};

export async function generateStaticParams() {
  return allDocs.map(({ url }) => ({
    doc: url,
  }));
}

const page = async ({ params }: pageProps) => {
  const { doc: title } = params;

  const doc = allDocs.find((doc) => doc.url.toLowerCase() === title.toLowerCase());

  if (!doc || !doc._id) {
    return notFound();
  }

  return (
    <Suspense fallback={'Loading...'}>
      <MDXRenderer content={doc.body.raw} />
    </Suspense>
  );
};

export default page;
