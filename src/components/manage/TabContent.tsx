'use client';

import { useManageTabStore } from '@/hooks/useManageTabStore';
import { Author } from '@/types/author.types';

import ReaderTab from './ReaderTab';
import AuthorTab from './AuthorTab';

type TabContentProps = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  image: string;
  isAuthor: boolean;
  author: Author | null;
};

const TabContent = ({ isAuthor, author, ...props }: TabContentProps) => {
  const tab = useManageTabStore((state) => state.tab);

  return (
    <>
      {tab === 'Reader' ? (
        <ReaderTab {...props} />
      ) : (
        <AuthorTab isAuthor={isAuthor} author={author} />
      )}
    </>
  );
};

export default TabContent;
