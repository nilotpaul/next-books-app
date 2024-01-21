import { AuthorByStars } from '@/types/author.types';

import AuthorCardClientWrapper from './AuthorCardClientWrapper';

type AuthorCardWrapperProps = {
  getAuthorData: () => Promise<AuthorByStars[]>;
};

const AuthorCardWrapper = async ({ getAuthorData }: AuthorCardWrapperProps) => {
  const authors = await getAuthorData();

  return <AuthorCardClientWrapper authors={authors} />;
};

export default AuthorCardWrapper;
