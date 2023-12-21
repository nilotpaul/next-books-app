'use client';

import { useManageTabStore } from '@/hooks/useManageTabStore';

import { Tabs, Tab } from '@nextui-org/tabs';

const ManageTabs = () => {
  const { tab, changeTab } = useManageTabStore((state) => state);

  return (
    <Tabs
      selectedKey={tab}
      onSelectionChange={() => changeTab()}
      classNames={{
        tabList: 'sm:flex-col',
        tabContent: 'sm:w-[150px]',
        base: 'sm:h-[calc(100vh-5.5rem)] sm:bg-stone-900/50 rounded-lg px-3 py-2',
      }}
      aria-label='Manage Account Options'
      color='secondary'
      variant='light'
    >
      <Tab
        key='Reader'
        title={
          <div className='flex items-center space-x-2'>
            <span className='text-sm font-medium'>Reader</span>
          </div>
        }
      />
      <Tab
        key='Author'
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
