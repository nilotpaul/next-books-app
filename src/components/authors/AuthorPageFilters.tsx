'use client';

import useSearchParams from '@/hooks/useSearchParams';
import { usePathname, useRouter } from 'next/navigation';

import { Select, SelectItem } from '@nextui-org/select';

const opts = ['A-Z', 'Z-A', 'Stars'];

const AuthorPageFilters = () => {
  const { setQueryParams, getQueryParams } = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Select
      // label='Filter'
      aria-label='Author Filter'
      labelPlacement='outside-left'
      defaultSelectedKeys={[getQueryParams('sort') || 'stars']}
      size='sm'
      onChange={(e) => {
        router.replace(pathname + '?' + setQueryParams('sort', e.target.value.toLowerCase()));
      }}
      className='w-[180px]'
      classNames={{
        base: 'flex-col gap-1',
        label: 'flex items-center',
      }}
    >
      {opts.map((opt) => (
        <SelectItem key={opt.toLowerCase()} textValue={opt} className='capitalize'>
          {opt.toLowerCase()}
        </SelectItem>
      ))}
    </Select>
  );
};

export default AuthorPageFilters;
