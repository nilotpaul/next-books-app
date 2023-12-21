'use client';

import { useManageTabStore } from '@/hooks/useManageTabStore';

import ReaderTab from './ReaderTab';
import AuthorTab from './AuthorTab';

type TabContentProps = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  image: string;
};

const TabContent = ({ ...props }: TabContentProps) => {
  const tab = useManageTabStore((state) => state.tab);

  return <div>{tab === 'Reader' ? <ReaderTab {...props} /> : <AuthorTab {...props} />}</div>;
};

export default TabContent;
