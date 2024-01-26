'use client';

import { useEffect } from 'react';
import { bookGenres } from '@/config/constants/author';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type BookFilters, bookFilterValidation } from '@/validations/bookValidation';
import { BOOK_AVAILABALITY, BOOK_LANGUAGES } from '@/config/constants/books';
import useSearchParams from '@/hooks/useSearchParams';
import { constructFilters, onSearchParamsChange } from '@/lib/constructFilters';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Select, SelectItem } from '@nextui-org/select';
import { Accordion, AccordionItem, Button, Input, Skeleton } from '@nextui-org/react';
import { FilterX, Search } from 'lucide-react';
import AuthorFilter from './AuthorFilter';
import { useMediaQuery } from '@mantine/hooks';
import { useMounted } from '@/hooks/useMounted';

const Filters = () => {
  const { deleteQueryParams } = useSearchParams();
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

  const isMobile = useMediaQuery('(min-width: 380px)');
  const [isMounted] = useMounted();

  useEffect(() => {
    if (Object.keys(errors).length) {
      Object.entries(errors).forEach(([_, value]) => {
        toast.error(value.message?.toString());
      });
    }
  }, [errors]);

  const handleFilterSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleSubmit((values) => {
      const cleanedObj = Object.fromEntries(Object.entries(values).filter(([_, value]) => value));
      const { genres, availability, authorName, language, price, publication, rating, series } =
        constructFilters(cleanedObj);
      const params = new URLSearchParams({
        ...(genres && { genres: genres.toString().toLowerCase() }),
        ...(availability && { availability: availability.toLowerCase() }),
        ...(authorName && { authorName: authorName.toLowerCase() }),
        ...(language && { language: language.toLowerCase() }),
        ...(price && { price }),
        ...(publication && { publication: publication.toString() }),
        ...(rating && { rating: rating.toString() }),
        ...(series && { series: series.toLowerCase() }),
      });
      router.replace(pathname + '?' + params);
    })(e);
  };

  if (!isMounted) {
    return <Skeleton className='h-12 w-full rounded-lg xs:h-[15rem]' />;
  }

  return (
    <Accordion
      defaultExpandedKeys={isMobile ? ['1'] : []}
      className='rounded-lg border border-default-200 bg-foreground-50/70 px-0'
    >
      <AccordionItem
        indicator={
          <div className='space-x-2 text-sm'>
            <Button onClick={() => router.replace(pathname)} size='sm' variant='light' isIconOnly>
              <FilterX className='h-4 w-4 text-danger xs:h-5 xs:w-5 sm:h-4 sm:w-4' />
            </Button>
            <Button onClick={handleFilterSubmit} size='sm' variant='flat' isIconOnly>
              <Search className='h-4 w-4 xs:h-5 xs:w-5 sm:h-4 sm:w-4' />
            </Button>
          </div>
        }
        key='1'
        aria-label='Filter Books'
        title='Filter Books'
        classNames={{
          base: 'px-0',
          heading: 'px-4 font-semibold',
          title: 'text-primary text-base xs:text-lg',
          indicator: 'data-[open]:rotate-0',
        }}
      >
        <div className='grid grid-cols-1 place-content-start gap-4 px-4 pb-2 xs:grid-cols-2 sm:max-h-full sm:grid-cols-3 md:grid-cols-4'>
          <Select
            multiple
            selectionMode='multiple'
            radius='sm'
            labelPlacement='outside'
            label='Select Genre(s)'
            placeholder='Enter genres'
            className='font-semibold'
            onChange={(e) =>
              onSearchParamsChange({
                name: 'genres',
                value: e.target.value,
                deleteQueryParams,
                pathname,
                router,
                action: (value) => setValue('genres', value?.split(',')),
              })
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
            onChange={(e) =>
              onSearchParamsChange({
                name: 'publication',
                value: e.target.value,
                deleteQueryParams,
                pathname,
                router,
                action: (value) => setValue('publication', Number(value) || undefined),
              })
            }
            label='Publication Year'
            placeholder='Enter publication year'
            labelPlacement='outside'
            radius='sm'
            className='font-semibold'
          />

          <Select
            onChange={(e) =>
              onSearchParamsChange({
                name: 'rating',
                value: e.target.value,
                deleteQueryParams,
                pathname,
                router,
                action: (value) => setValue('rating', Number(value) || undefined),
              })
            }
            label='Rating'
            placeholder='Select a rating'
            labelPlacement='outside'
            radius='sm'
            className='font-semibold'
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
            onChange={(e) =>
              onSearchParamsChange({
                name: 'price',
                value: e.target.value,
                deleteQueryParams,
                pathname,
                router,
                action: (value) => setValue('price', value),
              })
            }
            label='Price'
            placeholder='Enter a price'
            labelPlacement='outside'
            radius='sm'
            className='font-semibold'
          />

          <Select
            onChange={(e) =>
              onSearchParamsChange({
                name: 'language',
                value: e.target.value,
                deleteQueryParams,
                pathname,
                router,
                action: (value) => setValue('language', value),
              })
            }
            label='Language'
            placeholder='Select a language'
            labelPlacement='outside'
            radius='sm'
            className='font-semibold'
          >
            {BOOK_LANGUAGES.slice().map((item) => (
              <SelectItem key={item} textValue={item}>
                {item}
              </SelectItem>
            ))}
          </Select>
          <Input
            onChange={(e) =>
              onSearchParamsChange({
                name: 'series',
                value: e.target.value,
                deleteQueryParams,
                pathname,
                router,
                action: (value) => setValue('series', value),
              })
            }
            label='Series'
            placeholder='Enter a series'
            labelPlacement='outside'
            radius='sm'
            className='font-semibold'
          />
          <Select
            onChange={(e) =>
              onSearchParamsChange({
                name: 'availability',
                value: e.target.value,
                deleteQueryParams,
                pathname,
                router,
                action: (value) => setValue('availability', value),
              })
            }
            label='Availability'
            placeholder='Enter a availability'
            labelPlacement='outside'
            radius='sm'
            className='font-semibold'
          >
            {BOOK_AVAILABALITY.map((item) => (
              <SelectItem key={item} textValue={item}>
                {item}
              </SelectItem>
            ))}
          </Select>
        </div>
      </AccordionItem>
    </Accordion>
  );
};

export default Filters;
