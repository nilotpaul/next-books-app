import { allDocs } from '.contentlayer/generated';
import { Metadata } from 'next';
import { constructMetadata } from '@/lib/constructMetadata';

import DashNavbar from '@/components/dashboard/DashNavbar';
import DocsSidebar from '@/components/docs/DocsSidebar';
import Toc from '@/components/docs/Toc';
import Container from '@/components/ui/Container';

export async function generateMetadata({
  params: { doc: title },
}: {
  params: { doc: string };
}): Promise<Metadata> {
  const doc = allDocs.find(({ url }) => url.toLowerCase() === title.toLowerCase());

  if (!doc)
    return constructMetadata({
      title: 'Not Found',
      description: 'This page does not exist',
    });

  const docImg = doc.body.raw
    .match(/!\[.*?\]\(.*?\)/g)?.[0]
    .split(']')[1]
    .replaceAll('(', '')
    .replaceAll(')', '');

  return constructMetadata({
    title: doc.title,
    description: `${doc.title} explains the procedures to efficiently write books.`,
    image: docImg ?? undefined,
  });
}

const DocsLayout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { doc: string };
}) => {
  const menu = allDocs
    .sort((a, b) => Number(new Date(a.createdAt)) - Number(new Date(b.createdAt)))
    .map(({ title, url }) => ({ title, url }));

  return (
    <>
      <DashNavbar
        classNames={{
          container: 'max-w-7xl',
        }}
      />

      <Container className='mb-16 mt-6 grid min-h-screen w-full max-w-7xl grid-cols-1 place-content-between gap-4 md:grid-cols-[1.5fr_4fr] lg:grid-cols-[1fr_3fr_1fr] lg:gap-8'>
        <DocsSidebar menu={menu} />

        {children}

        <Toc doc={params.doc} />
      </Container>
    </>
  );
};

export default DocsLayout;
