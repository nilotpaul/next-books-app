'use client';

import { useEffect } from 'react';
import { useToggleTabStore } from '@/hooks/useToggleTabStore';

import { Tabs, Tab } from '@nextui-org/tabs';
import DashSidebarSkeleton from '../loadings/DashSidebarSkeleton';

type DashSidebarProps = {
  isAuthor: boolean;
};

const DashSidebar = ({ isAuthor }: DashSidebarProps) => {
  const { tab, changeTab } = useToggleTabStore((state) => state);

  useEffect(() => {
    changeTab('My Books');
  }, []);

  if (tab?.length === 0) {
    return <DashSidebarSkeleton />;
  }

  const menu = ['My Books', 'Books Sold', 'Purchases', 'Forum Posts'];
  const onlyForAuthor = ['My Books', 'Books Sold'];

  return (
    <Tabs
      defaultSelectedKey='My Books'
      selectedKey={tab}
      onSelectionChange={(key) => changeTab(key.toString())}
      classNames={{
        tabList: 'sm:flex-col',
        tabContent: 'sm:w-[150px]',
        base: 'sm:h-[calc(100vh-5.5rem)] sm:bg-content1 dark:border-0 sm:box-border sm:border-1 sm:shadow-lg dark:sm:bg-stone-900/50 rounded-lg px-3 py-2',
      }}
      aria-label='Dashboard'
      color='secondary'
      variant='light'
    >
      {menu
        .filter((item) => (!isAuthor ? !onlyForAuthor.includes(item) : item))
        .map((item) => {
          return (
            <Tab
              key={item}
              className='text-black data-[disabled=true]:opacity-30 dark:text-white'
              title={
                <div className='flex items-center space-x-2'>
                  <span className='text-sm font-medium'>{item}</span>
                </div>
              }
            />
          );
        })}
    </Tabs>
  );
};

export default DashSidebar;
