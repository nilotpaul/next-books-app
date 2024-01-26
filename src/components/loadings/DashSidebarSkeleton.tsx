import { Skeleton } from '@nextui-org/skeleton';

const DashSidebarSkeleton = () => {
  return (
    <div className='relative rounded-lg sm:h-[calc(100vh-5.5rem)] sm:w-[264px]'>
      <div className='flex h-full w-2/3 gap-3 rounded-lg px-3 pl-0 dark:border-0 sm:w-full sm:flex-col sm:border-1 sm:py-2 sm:pl-3 sm:shadow-lg dark:sm:bg-stone-900/50'>
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} className='h-8 w-full rounded-lg' />
          ))}
      </div>
    </div>
  );
};

export default DashSidebarSkeleton;
