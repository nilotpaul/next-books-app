import { AuthorByStars } from '@/types/author.types';

import AuthorCard from './AuthorCard';

type AuthorCardWrapperProps = {
  getAuthorData: () => Promise<AuthorByStars[]>;
};

const AuthorCardWrapper = async ({ getAuthorData }: AuthorCardWrapperProps) => {
  const authors = await getAuthorData();

  return <AuthorCard authors={authors} />;
};

export default AuthorCardWrapper;
