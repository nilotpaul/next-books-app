'use client';

import { useEffect } from 'react';
import { useToggleTabStore } from '@/hooks/useToggleTabStore';

import { Tabs, Tab } from '@nextui-org/tabs';
import WriteBooksTabSkeleton from '../loadings/WriteBooksTabSkeleton';

type DashSidebarProps = {
  isAuthor: boolean;
};

const DashSidebar = ({ isAuthor }: DashSidebarProps) => {
  const { tab, changeTab } = useToggleTabStore((state) => state);

  useEffect(() => {
    changeTab('My Books');
  }, []);

  if (tab?.length === 0) {
    return <WriteBooksTabSkeleton />;
  }

  return (
    <Tabs
      defaultSelectedKey='My Books'
      selectedKey={tab}
      onSelectionChange={(key) => changeTab(key.toString())}
      classNames={{
        tabList: 'sm:flex-col',
        tabContent: 'sm:w-[150px]',
        base: 'sm:h-[calc(100vh-5.5rem)] sm:bg-stone-900/50 rounded-lg px-3 py-2',
      }}
      aria-label='Dashboard'
      color='secondary'
      variant='light'
    >
      {isAuthor && (
        <Tab
          key='My Books'
          title={
            <div className='flex items-center space-x-2'>
              <span className='text-sm font-medium'>My Books</span>
            </div>
          }
        />
      )}
      <Tab
        key='Purchases'
        title={
          <div className='flex items-center space-x-2'>
            <span className='text-sm font-medium'>Purchases</span>
          </div>
        }
      />
    </Tabs>
  );
};

export default DashSidebar;
