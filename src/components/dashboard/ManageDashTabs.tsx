'use client';

import { useToggleTabStore } from '@/hooks/useToggleTabStore';

import { Card, CardHeader, CardBody } from '@nextui-org/card';
import { Button } from '@nextui-org/button';
import WriteBooksTab from './WriteBooksTab';
import ReadingTab from './ReadingTab';
import Divider from '../ui/Divider';
import { Plus } from 'lucide-react';

const ManageDashTabs = () => {
  const tab = useToggleTabStore((state) => state.tab);

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

          <Button
            variant='solid'
            color='success'
            size='sm'
            startContent={<Plus className='h-4 w-4 font-extrabold' />}
            className='gap-1.5 text-small font-semibold text-black'
          >
            Write Book
          </Button>
        </CardHeader>

        <CardBody className='h-full py-2 pl-0 sm:pl-3'>
          {tab === 'WriteBooks' ? <WriteBooksTab /> : <ReadingTab />}
        </CardBody>
      </Card>
    </>
  );
};

export default ManageDashTabs;
