'use client';

import { bookGenres } from '@/config/constants/author';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type BookFilters, bookFilterValidation } from '@/validations/bookValidation';
import { BOOK_AVAILABALITY, BOOK_LANGUAGES } from '@/config/constants/books';
import useSearchParams from '@/hooks/useSearchParams';
import { usePathname, useRouter } from 'next/navigation';

import { Select, SelectItem } from '@nextui-org/select';
import { Button, Input } from '@nextui-org/react';
import { FilterX, Search } from 'lucide-react';
import AuthorFilter from './AuthorFilter';

const Filters = () => {
  const { setQueryParams } = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<BookFilters>({
    resolver: zodResolver(bookFilterValidation),
    mode: 'onChange',
    defaultValues: {
      authorName: undefined,
      availability: undefined,
      genres: undefined,
      language: undefined,
      price: undefined,
      publication: undefined,
      rating: undefined,
      series: undefined,
    },
  });

  return (
    <form
      onSubmit={handleSubmit((values) => {
        const cleanedObj = Object.fromEntries(Object.entries(values).filter(([_, value]) => value));
        Object.entries(cleanedObj).map(([key, value]) => {
          router.replace(pathname + '?' + setQueryParams(key, value.toString().toLowerCase()));
        });
      })}
      className='relative grid grid-cols-4 gap-4 rounded-lg border border-danger/70 bg-foreground-50/70 p-4 py-5'
    >
      <Select
        multiple
        selectionMode='multiple'
        radius='sm'
        labelPlacement='outside'
        label='Select Genre(s)'
        placeholder='Enter genres'
        onChange={(e) =>
          setValue('genres', [...e.target?.value.split(',')] as BookFilters['genres'])
        }
      >
        {bookGenres.map((genre) => (
          <SelectItem key={genre} textValue={genre}>
            {genre}
          </SelectItem>
        ))}
      </Select>

      <AuthorFilter setValue={setValue} />
      <Input
        onChange={(e) => {
          setValue('publication', Number(e.target.value));
        }}
        label='Publication Year'
        placeholder='Enter publication year'
        labelPlacement='outside'
        radius='sm'
      />

      <Select
        onChange={(e) => {
          setValue('rating', Number(e.target.value));
        }}
        label='Rating'
        placeholder='Select a rating'
        labelPlacement='outside'
        radius='sm'
      >
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <SelectItem key={index + 1} textValue={(index + 1).toString()}>
              {(index + 1).toString()}
            </SelectItem>
          ))}
      </Select>
      <Input
        onChange={(e) => {
          setValue('price', e.target.value);
        }}
        label='Price'
        placeholder='Enter a price'
        labelPlacement='outside'
        radius='sm'
      />

      <Select
        onChange={(e) => {
          if (e.target.value.length !== 0) {
            setValue('language', e.target.value as BookFilters['language']);
          }
        }}
        label='Language'
        placeholder='Select a language'
        labelPlacement='outside'
        radius='sm'
      >
        {BOOK_LANGUAGES.slice().map((item) => (
          <SelectItem key={item} textValue={item}>
            {item}
          </SelectItem>
        ))}
      </Select>
      <Input
        onChange={(e) => {
          if (e.target.value.length !== 0) {
            setValue('series', e.target.value);
          }
        }}
        label='Series'
        placeholder='Enter a series'
        labelPlacement='outside'
        radius='sm'
      />
      <Select
        onChange={(e) => {
          if (e.target.value.length !== 0) {
            setValue('availability', e.target.value as 'Free' | 'Paid');
          }
        }}
        label='Availability'
        placeholder='Enter a availability'
        labelPlacement='outside'
        radius='sm'
      >
        {BOOK_AVAILABALITY.map((item) => (
          <SelectItem key={item} textValue={item}>
            {item}
          </SelectItem>
        ))}
      </Select>

      <div className='absolute right-4 top-1 space-x-2 text-sm'>
        <Button onClick={() => router.replace(pathname)} size='sm' variant='ghost' isIconOnly>
          <FilterX className='h-4 w-4 text-danger' />
        </Button>
        <Button type='submit' size='sm' variant='flat' isIconOnly>
          <Search className='h-4 w-4' />
        </Button>
      </div>
    </form>
  );
};

export default Filters;
