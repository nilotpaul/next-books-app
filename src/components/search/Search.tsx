import { userSession } from '@/services/auth.services';
import { User } from '@clerk/nextjs/server';

import SearchModal from '../modals/SearchModal';

const Search = async () => {
  const user = (await userSession()) as User;

  return (
    <>
      <SearchModal userId={user?.id} />
    </>
  );
};

export default Search;
