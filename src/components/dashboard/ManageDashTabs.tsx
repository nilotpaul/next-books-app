'use client';

import { useContext } from 'react';
import { useToggleTabStore } from '@/hooks/useToggleTabStore';
import { useMounted } from '@/hooks/useMounted';
import { BooksWithoutNT } from '@/types/book.types';
import { MyDashboardContext } from '../context/DashboardContext';

import WriteBooksTab from './WriteBooksTab';
import Divider from '../ui/Divider';
import CreateBookModal from '../modals/CreateBookModal';
import Image from '../ui/Image';
import WriteBooksTabSkeleton from '../loadings/WriteBooksTabSkeleton';
import PurchaseTab from './PurchaseTab';
import ReviewTab from './ReviewTab';
import ForumPosts from './ForumPosts';

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
                <Image
                  src={books[0].authorImage || ''}
                  alt={books[0].authorName!}
                  fill
                  isBlurred
                  radius='full'
                  classNames={{ wrapper: 'min-h-[30px] min-w-[30px]' }}
                />
                <p className='text-sm'>{books[0].authorName}</p>
              </div>
              <CreateBookModal userId={userId} />
            </div>

            <Divider className='h-[1px] rounded-md bg-default' />
          </header>

          {books.length > 0 && <WriteBooksTab />}
        </>
      )}

      {tab === 'Purchases' && <PurchaseTab />}
      {tab === 'Forum Posts' && <ForumPosts />}
      {tab === 'Review' && <ReviewTab />}
    </>
  );
};

export default ManageDashTabs;
