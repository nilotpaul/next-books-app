import useSearchParams from '@/hooks/useSearchParams';
import { usePathname, useRouter } from 'next/navigation';

import { Input } from '@nextui-org/react';
import { Search } from 'lucide-react';
import { useEffect, useRef } from 'react';

type SearchInputProps = {
  isOpen: boolean;
};

const SearchInput = ({ isOpen }: SearchInputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const router = useRouter();
  const { setQueryParams, getQueryParams } = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    inputRef.current?.focus();
  }, [isOpen]);

  return (
    <Input
      ref={inputRef}
      onValueChange={(value) => {
        router.replace(pathname + '?' + setQueryParams('q', value.toLowerCase()));
      }}
      defaultValue={getQueryParams('q')}
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
