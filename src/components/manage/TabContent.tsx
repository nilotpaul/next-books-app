'use client';

import { useToggleTabStore } from '@/hooks/useToggleTabStore';
import { Author } from '@/types/author.types';
import { useMounted } from '@/hooks/useMounted';

import ReaderTab from './ReaderTab';
import AuthorTab from './AuthorTab';
import ManageSkeleton from '../loadings/ManageSkeleton';

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
  const tab = useToggleTabStore((state) => state.tab);

  const [isMounted] = useMounted();

  if (!isMounted) {
    return <ManageSkeleton />;
  }

  return (
    <>
      {tab === 'Reader' ? (
        <ReaderTab {...props} />
      ) : (
        <AuthorTab
          isAuthor={isAuthor}
          author={author}
          links={{
            instagram: author?.instagram ?? '',
            twitter: author?.twitter ?? '',
          }}
        />
      )}
    </>
  );
};

export default TabContent;
