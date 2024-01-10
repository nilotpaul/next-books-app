import { useSearchParams as nextSearchParams } from 'next/navigation';
import { useCallback } from 'react';

const useSearchParams = () => {
  const searchParams = nextSearchParams();

  const setQueryParams = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const getQueryParams = useCallback(
    (name: string) => {
      const params = searchParams?.get(name);

      return params?.toString();
    },
    [searchParams]
  );

  return { setQueryParams, getQueryParams };
};

export default useSearchParams;
