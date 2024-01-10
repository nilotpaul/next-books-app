import { useState } from 'react';
import { trpc } from '@/lib/trpc/TRPCProvider';
import { useDebounce } from '@/hooks/useDebounce';
import { UseFormSetValue } from 'react-hook-form';
import { type BookFilters } from '@/validations/bookValidation';

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
    onSettled: (data, err) => {
      if (!data || data.length === 0) {
        toast.error(err?.message);
      }
    },
  });

  return (
    <Autocomplete
      onSelectionChange={(value) => {
        setValue('authorName', value.toString());
      }}
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
