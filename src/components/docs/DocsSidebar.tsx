'use client';

import { usePathname } from 'next/navigation';
import { useMediaQuery } from '@mantine/hooks';
import { useMounted } from '@/hooks/useMounted';

import { cn } from '@/utils/utils';
import { Listbox, ListboxItem } from '@nextui-org/listbox';
import Link from 'next/link';
import { Accordion, AccordionItem } from '@nextui-org/accordion';
import { Skeleton } from '@nextui-org/skeleton';

type DocsSidebarProps = {
  menu: { title: string; url: string }[];
};

const DocsSidebar = ({ menu }: DocsSidebarProps) => {
  const pathname = usePathname();
  const isMobile = useMediaQuery('(min-width: 380px)');

  const [isMounted] = useMounted();

  if (!isMounted) {
    return <Skeleton className='h-10 w-full rounded-md md:mt-5 md:h-32' />;
  }

  return (
    <Accordion
      className='-ml-2 mb-0 pb-0'
      variant='light'
      defaultExpandedKeys={isMobile ? ['1'] : []}
    >
      <AccordionItem title='Table of contents' key='1'>
        <Listbox aria-label='Docs Sidebar'>
          {menu.map(({ title, url }) => (
            <ListboxItem
              as={Link}
              href={title === 'Documentation' ? '/docs' : `/docs/${url.toLowerCase()}`}
              variant='light'
              key={title}
              classNames={{
                title: cn('text-base capitalize font-semibold', {
                  'text-secondary underline': pathname.replace('/docs/', '') === url.toLowerCase(),
                }),
              }}
            >
              {title}
            </ListboxItem>
          ))}
        </Listbox>
      </AccordionItem>
    </Accordion>
  );
};

export default DocsSidebar;
