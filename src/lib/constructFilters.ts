import { capitalizeString } from '@/utils/utils';
import { BookFilters } from '@/validations/bookValidation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

// taking and structuring on necessary values from params
export function constructFilters(searchParams: BookFilters) {
  const filters: BookFilters = {
    genres: searchParams.genres?.toString().split(','),
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

export function onSearchParamsChange({
  name,
  value,
  action,
  deleteQueryParams,
  pathname,
  router,
}: {
  name: string;
  value: string;
  action: (value: string) => void;
  deleteQueryParams: (name: string) => string | undefined;
  pathname: string;
  router: AppRouterInstance;
}) {
  if (!value || value.length === 0) {
    const params = deleteQueryParams(name);
    params !== undefined && router.replace(pathname + '?' + params);
    return;
  }

  action(value);
}
