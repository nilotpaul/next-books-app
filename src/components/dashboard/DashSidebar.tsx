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

  const menu = ['My Books', 'Purchases', 'Reviews'];

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
      {menu.map((item) => {
        if (item === 'My Books' && isAuthor) {
          return (
            <Tab
              key={item}
              title={
                <div className='flex items-center space-x-2'>
                  <span className='text-sm font-medium'>{item}</span>
                </div>
              }
            />
          );
        }
        return (
          <Tab
            key={item}
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
