'use client';

import { useToggleTabStore } from '@/hooks/useToggleTabStore';
import { useMounted } from '@/hooks/useMounted';

import { Card, CardHeader, CardBody } from '@nextui-org/card';
import WriteBooksTab from './WriteBooksTab';
import ReadingTab from './ReadingTab';
import Divider from '../ui/Divider';
import CreateBookModal from '../modals/CreateBookModal';
import { Loader2Icon } from 'lucide-react';

type ManageDashTabsProps = {
  userId: string;
};

const ManageDashTabs = ({ userId }: ManageDashTabsProps) => {
  const tab = useToggleTabStore((state) => state.tab);

  const [isMounted] = useMounted();

  if (!isMounted) {
    return (
      <div className='flex h-full w-full items-center justify-center'>
        <Loader2Icon className='h-12 w-12 animate-spin text-primary' />
      </div>
    );
  }

  return (
    <>
      <Card
        fullWidth
        className='min-h-full space-y-2'
        classNames={{
          base: 'bg-stone-800/50',
        }}
      >
        <CardHeader className='flex w-full items-center justify-between pb-1 text-lg font-semibold text-foreground-600'>
          <span>
            {tab === 'WriteBooks' ? 'Written Books' : 'Reading'} <Divider className='w-[150px]' />
          </span>

          <CreateBookModal userId={userId} />
        </CardHeader>

        <CardBody className='h-full py-2 pl-0 sm:pl-3'>
          {tab === 'WriteBooks' ? <WriteBooksTab /> : <ReadingTab />}
        </CardBody>
      </Card>
    </>
  );
};

export default ManageDashTabs;
