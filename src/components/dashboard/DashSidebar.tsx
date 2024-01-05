'use client';

import { useToggleTabStore } from '@/hooks/useToggleTabStore';

import { Tabs, Tab } from '@nextui-org/tabs';

type DashSidebarProps = {
  isAuthor: boolean;
};

const DashSidebar = ({ isAuthor }: DashSidebarProps) => {
  const { tab, changeTab } = useToggleTabStore();

  return (
    <Tabs
      defaultSelectedKey='WriteBook'
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
          key='WriteBooks'
          title={
            <div className='flex items-center space-x-2'>
              <span className='text-sm font-medium'>Write Books</span>
            </div>
          }
        />
      )}
      <Tab
        key='Reading'
        title={
          <div className='flex items-center space-x-2'>
            <span className='text-sm font-medium'>Reading</span>
          </div>
        }
      />
    </Tabs>
  );
};

export default DashSidebar;
