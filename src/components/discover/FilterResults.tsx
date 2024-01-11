import { getPublishedBooks } from '@/services/books.services';

import ResultWrapper from './ResultWrapper';
import { constructFilters } from '@/lib/constructFilters';
import { PublishedBook } from '@/types/book.types';

type FilterResultsProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const FilterResults = async ({ searchParams }: FilterResultsProps) => {
  let books: PublishedBook[] = [];
  const filters = constructFilters(searchParams);

  if (Object.values(searchParams).length === 0) {
    books = await getPublishedBooks();
  }

  return <ResultWrapper filters={filters} books={books} />;
};

export default FilterResults;
