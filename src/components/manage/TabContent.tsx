'use client';

import { useToggleTabStore } from '@/hooks/useToggleTabStore';
import { Author, SocialLinks } from '@/types/author.types';

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
  links: SocialLinks | null;
};

const TabContent = ({ isAuthor, author, links, ...props }: TabContentProps) => {
  const tab = useToggleTabStore((state) => state.tab);

  return (
    <>
      {tab === 'Reader' ? (
        <ReaderTab {...props} />
      ) : (
        <AuthorTab isAuthor={isAuthor} author={author} links={links} />
      )}
    </>
  );
};

export default TabContent;
