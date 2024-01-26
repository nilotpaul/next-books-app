'use client';

import { useContext } from 'react';
import { useToggleTabStore } from '@/hooks/useToggleTabStore';
import { useMounted } from '@/hooks/useMounted';
import { MyDashboardContext } from '../context/DashboardContext';

import WriteBooksTab from './WriteBooksTab';
import Divider from '../ui/Divider';
import CreateBookModal from '../modals/CreateBookModal';
import Image from '../ui/Image';
import WriteBooksTabSkeleton from '../loadings/WriteBooksTabSkeleton';
import PurchaseTab from './PurchaseTab';
import ForumPostsTab from './ForumPostsTab';
import EmptyArrayFallback from '../EmptyArrayFallback';
import BooksSoldTab from './BooksSoldTab';

const ManageDashTabs = () => {
  const {
    isAuthor,
    authorBooks,
    user: { userId },
  } = useContext(MyDashboardContext);
  const books = authorBooks || [];
  const tab = useToggleTabStore((state) => state.tab);

  const [isMounted] = useMounted();

  if (!isMounted) {
    return <WriteBooksTabSkeleton />;
  }

  return (
    <>
      {tab === 'My Books' && isAuthor && (
        <>
          <header className='flex flex-col items-end justify-center space-y-1.5 pb-3'>
            <div className='flex w-full items-center justify-between'>
              <div className='flex items-center gap-3'>
                {books[0].authorImage && (
                  <Image
                    src={books[0].authorImage}
                    alt={books[0].authorName}
                    fill
                    radius='full'
                    classNames={{
                      wrapper:
                        'min-h-[30px] xs:min-w-[40px] xs:min-h-[40px] sm:min-w-[30px] sm:min-h-[30px] min-w-[30px]',
                    }}
                    className='object-cover'
                  />
                )}
                <p className='truncate text-sm font-medium xs:text-base sm:text-sm'>
                  {books[0].authorName}
                </p>
              </div>

              <CreateBookModal userId={userId} />
            </div>

            <Divider className='h-[1px] rounded-md bg-default' />
          </header>

          {books.length !== 0 ? (
            <WriteBooksTab />
          ) : (
            <div className='flex w-full items-center justify-center'>
              <EmptyArrayFallback
                message='No written books yet!'
                className='static mx-auto mt-2 -translate-x-0'
              />
            </div>
          )}
        </>
      )}

      {tab === 'Books Sold' && isAuthor && <BooksSoldTab />}
      {tab === 'Purchases' && <PurchaseTab />}
      {tab === 'Forum Posts' && <ForumPostsTab />}
    </>
  );
};

export default ManageDashTabs;
