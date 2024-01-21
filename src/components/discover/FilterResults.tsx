import { getPublishedBooks } from '@/services/books.services';
import { MAX_SEARCH_RESULTS_LIMIT } from '@/config/constants/search-filters';
import { constructFilters } from '@/lib/constructFilters';

import ResultWrapper from './ResultWrapper';

type FilterResultsProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const FilterResults = async ({ searchParams }: FilterResultsProps) => {
  const books = await getPublishedBooks(MAX_SEARCH_RESULTS_LIMIT + 1);
  const filters = constructFilters(searchParams);

  return <ResultWrapper books={books || []} filters={filters} />;
};

export default FilterResults;
