'use client';

import { useMounted } from '@/hooks/useMounted';
import { useToggleTabStore } from '@/hooks/useToggleTabStore';

import { Tabs, Tab } from '@nextui-org/tabs';
import DashSidebarSkeleton from '../loadings/DashSidebarSkeleton';

const ManageTabs = () => {
  const { tab, changeTab } = useToggleTabStore((state) => state);

  const [isMounted] = useMounted();

  if (!isMounted) {
    return <DashSidebarSkeleton />;
  }

  return (
    <Tabs
      selectedKey={tab}
      onSelectionChange={(key) => changeTab(key.toString())}
      classNames={{
        tabList: 'sm:flex-col',
        tabContent: 'sm:w-[150px]',
        base: 'sm:h-[calc(100vh-5.5rem)] sm:bg-content1 dark:border-0 sm:box-border sm:border-1 sm:shadow-lg dark:sm:bg-stone-900/50 rounded-lg px-3 py-2',
      }}
      aria-label='Manage Account Options'
      color='secondary'
      variant='light'
    >
      <Tab
        key='Reader'
        className='text-black data-[disabled=true]:opacity-30 dark:text-white'
        title={
          <div className='flex items-center space-x-2'>
            <span className='text-sm font-medium'>Reader</span>
          </div>
        }
      />
      <Tab
        key='Author'
        className='text-black  data-[disabled=true]:opacity-30 dark:text-white'
        title={
          <div className='flex items-center space-x-2'>
            <span className='text-sm font-medium'>Author</span>
          </div>
        }
      />
    </Tabs>
  );
};

export default ManageTabs;
