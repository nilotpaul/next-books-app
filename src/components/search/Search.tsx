import { userSession } from '@/services/auth.services';

import { Button } from '@nextui-org/button';
import { SearchIcon } from 'lucide-react';

const Search = async () => {
  const user = await userSession();

  return (
    <>
      {user?.id && (
        <Button size='sm' isIconOnly radius='md'>
          <SearchIcon className='h-5 w-5' />
        </Button>
      )}
    </>
  );
};

export default Search;
