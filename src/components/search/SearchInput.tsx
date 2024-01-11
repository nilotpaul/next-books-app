import useSearchParams from '@/hooks/useSearchParams';
import { usePathname, useRouter } from 'next/navigation';

import { Input } from '@nextui-org/react';
import { Search } from 'lucide-react';

const SearchInput = () => {
  const router = useRouter();
  const { setQueryParams } = useSearchParams();
  const pathname = usePathname();

  return (
    <Input
      onValueChange={(value) => {
        router.replace(pathname + '?' + setQueryParams('q', value.toLowerCase()));
      }}
      labelPlacement='outside'
      radius='none'
      size='lg'
      color='primary'
      startContent={<Search className='mr-2 h-6 w-6 text-foreground-500' />}
      placeholder='Search for a book title'
      classNames={{
        inputWrapper: 'rounded-md rounded-b-none border-b-1 border-b-danger',
        clearButton: 'text-danger',
      }}
      className='bg-background'
    />
  );
};

export default SearchInput;
