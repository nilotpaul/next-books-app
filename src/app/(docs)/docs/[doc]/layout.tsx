import { allDocs } from '.contentlayer/generated';

import DashNavbar from '@/components/dashboard/DashNavbar';
import DocsSidebar from '@/components/docs/DocsSidebar';
import Toc from '@/components/docs/Toc';
import Profile from '@/components/navbar/Profile';
import Container from '@/components/ui/Container';

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
      >
        <Profile />
      </DashNavbar>

      <Container className='mb-16 mt-6 grid min-h-screen w-full max-w-7xl grid-cols-1 place-content-between gap-4 md:grid-cols-[1.5fr_4fr] lg:grid-cols-[1fr_3fr_1fr] lg:gap-8'>
        <DocsSidebar menu={menu} />

        {children}

        <Toc doc={params.doc} />
      </Container>
    </>
  );
};

export default DocsLayout;