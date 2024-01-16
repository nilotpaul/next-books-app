import { userSession } from '@/services/auth.services';
import { User } from '@clerk/nextjs/server';
import { Suspense } from 'react';
import DashSidebarSkeleton from '@/components/loadings/DashSidebarSkeleton';
import { getUserById } from '@/services/user.services';
import { getUserName } from '@/utils/getUserFullName';

import SidebarWrapper from '@/components/dashboard/SidebarWrapper';
import TabsWrapper from '@/components/dashboard/TabsWrapper';
import WriteBooksTabSkeleton from '@/components/loadings/WriteBooksTabSkeleton';

const dashboard = () => {
  return (
    <div className='flex w-full flex-col gap-y-4 sm:flex-row sm:gap-x-8 sm:gap-y-0'>
      <Suspense fallback={<DashSidebarSkeleton />}>
        <SidebarWrapper
          getAuthor={async () => {
            const user = (await userSession()) as User;
            return (await getUserById(user.id))?.isAuthor!;
          }}
        />
      </Suspense>

      <div className='relative h-[calc(100vh-9.5rem)] w-full overflow-y-auto rounded-lg scrollbar-hide scrollbar-track-default scrollbar-thumb-foreground-400 scrollbar-track-rounded-full scrollbar-thumb-rounded scrollbar-w-1.5 sm:h-[calc(100vh-5.5rem)] sm:pr-4 sm:scrollbar'>
        <Suspense fallback={<WriteBooksTabSkeleton />}>
          <TabsWrapper
            getData={async () => {
              const user = (await userSession()) as User;
              const isAuthor = (await getUserById(user.id))?.isAuthor!;
              return {
                user: {
                  userId: user.id,
                  userImage: user.imageUrl,
                  name: getUserName(user.firstName || '', user.lastName || '').fullName,
                },
                isAuthor,
              };
            }}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default dashboard;
