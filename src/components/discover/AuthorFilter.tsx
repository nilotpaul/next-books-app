import { useState } from 'react';
import { trpc } from '@/lib/trpc/TRPCProvider';
import { useDebounce } from '@/hooks/useDebounce';
import { UseFormSetValue } from 'react-hook-form';
import { type BookFilters } from '@/validations/bookValidation';
import { onSearchParamsChange } from '@/lib/constructFilters';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import useSearchParams from '@/hooks/useSearchParams';

import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete';
import { toast } from 'sonner';

type AuthorFilterProps = {
  setValue: UseFormSetValue<BookFilters>;
};

const AuthorFilter = ({ setValue }: AuthorFilterProps) => {
  const [input, setInput] = useState('');
  const debouncedInput = useDebounce(input, 800);

  const { data, isFetching } = trpc.authorRouter.search.useQuery(debouncedInput, {
    enabled: debouncedInput.length >= 2,
    retry: 2,
    retryDelay: 800,
    refetchOnWindowFocus: false,
    onSettled: (data) => {
      if (!data || data?.length === 0) {
        toast.error('No author found');
      }
    },
  });

  const pathname = usePathname();
  const router = useRouter();
  const { deleteQueryParams } = useSearchParams();

  return (
    <Autocomplete
      onSelectionChange={(value) =>
        onSearchParamsChange({
          name: 'authorName',
          value: value?.toString(),
          deleteQueryParams,
          pathname,
          router,
          action: (val) => setValue('authorName', val),
        })
      }
      onClear={() => router.replace(pathname + '?' + deleteQueryParams('authorName'))}
      defaultItems={data || []}
      isLoading={isFetching}
      onInputChange={(input) => setInput(input)}
      labelPlacement='outside'
      radius='sm'
      label='Select Author'
      placeholder='Enter author name'
    >
      {({ authorName, id }) => <AutocompleteItem key={id}>{authorName}</AutocompleteItem>}
    </Autocomplete>
  );
};

export default AuthorFilter;
