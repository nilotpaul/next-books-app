'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { createTRPCReact } from '@trpc/react-query';
import { AppRouter } from '@/trpc/root';
import { httpBatchLink } from '@trpc/client';
import getUrl from '../../utils/getUrl';
import superjson from 'superjson';

export const trpc = createTRPCReact<AppRouter>();

export default function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: getUrl('/api/trpc'),
        }),
      ],
      transformer: superjson,
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
