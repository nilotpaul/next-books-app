'use client';

import { useToggleTabStore } from '@/hooks/useToggleTabStore';
import { useMounted } from '@/hooks/useMounted';
import { BooksWithoutNT } from '@/types/book.types';

import WriteBooksTab from './WriteBooksTab';
import Divider from '../ui/Divider';
import ReadingTab from './ReadingTab';
import CreateBookModal from '../modals/CreateBookModal';
import Image from '../ui/Image';
import WriteBooksTabSkeleton from '../loadings/WriteBooksTabSkeleton';

type ManageDashTabsProps = {
  userId: string;
  books: (BooksWithoutNT[number] & {
    authorImage: string | null;
    authorName: string | null;
  })[];
  isAuthor: boolean;
};

const ManageDashTabs = ({ userId, books, isAuthor }: ManageDashTabsProps) => {
  const tab = useToggleTabStore((state) => state.tab);

  const [isMounted] = useMounted();

  if (!isMounted) {
    return <WriteBooksTabSkeleton />;
  }

  return (
    <>
      <header className='flex flex-col items-end justify-center space-y-1.5 pb-3'>
        {tab === 'WriteBooks' && isAuthor && (
          <>
            <div className='flex w-full items-center justify-between'>
              <div className='flex items-center gap-3'>
                <Image
                  src={books[0].authorImage || ''}
                  alt={books[0].authorName!}
                  width={30}
                  height={30}
                  isBlurred
                />
                <p className='text-sm'>{books[0].authorName}</p>
              </div>
              <CreateBookModal userId={userId} />
            </div>

            <Divider className='h-[1px] rounded-md bg-default' />
          </>
        )}
      </header>

      {tab === 'WriteBooks' && isAuthor ? (
        <>{books.length > 0 && <WriteBooksTab books={books} />}</>
      ) : (
        <ReadingTab />
      )}
    </>
  );
};

export default ManageDashTabs;
