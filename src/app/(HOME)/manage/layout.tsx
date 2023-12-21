import ManageTabs from '@/components/manage/ManageTabs';

export default function ManageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0'>
      <ManageTabs />
      <div className='scrollbar-track-rounded-full scrollbar-track-default scrollbar-w-1.5 scrollbar-thumb-foreground-400 scrollbar-thumb-rounded-full scrollbar w-full overflow-y-auto rounded-lg bg-stone-900/50 px-3 py-2 sm:h-[calc(100vh-5.5rem)]'>
        {children}
      </div>
    </div>
  );
}
