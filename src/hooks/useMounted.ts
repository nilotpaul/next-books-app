import { useEffect, useState } from 'react';

export const useMounted = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true);
    }
  }, []);

  return [isMounted] as const;
};
