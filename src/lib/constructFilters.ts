import { capitalizeString } from '@/utils/utils';
import { BookFilters } from '@/validations/bookValidation';

export function constructFilters(searchParams: BookFilters) {
  const filters: BookFilters = {
    genres: searchParams.genres
      ?.toString()
      .replace(' ', '')
      .split(',')
      .map((genre) => capitalizeString(genre)),
    publication: Number(searchParams.publication) || undefined,
    rating: Number(searchParams.rating) || undefined,
    price: searchParams.price?.toString() || undefined,
    language:
      (capitalizeString((searchParams.language || '') as string) as BookFilters['language']) ||
      undefined,
    series: (searchParams.series as string) || undefined,
    availability:
      (capitalizeString(
        (searchParams.availability || '') as string
      ) as BookFilters['availability']) || undefined,
    authorName: searchParams.authorName?.toString() || undefined,
  };

  return filters;
}
