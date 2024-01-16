import { Skeleton } from '@nextui-org/skeleton';

const DashSidebarSkeleton = () => {
  return (
    <div className='relative w-[264px] rounded-lg sm:h-[calc(100vh-5.5rem)]'>
      <div className='h-full w-full space-y-3 rounded-lg bg-stone-900/50 px-3 py-2'>
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
