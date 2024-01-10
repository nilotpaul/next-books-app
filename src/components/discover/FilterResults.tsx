import { getPublishedBooks } from '@/services/books.services';

import ResultWrapper from './ResultWrapper';
import { constructFilters } from '@/lib/constructFilters';

type FilterResultsProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const FilterResults = async ({ searchParams }: FilterResultsProps) => {
  const filters = constructFilters(searchParams);
  const books = await getPublishedBooks();

  return <ResultWrapper filters={filters} books={books} />;
};

export default FilterResults;
