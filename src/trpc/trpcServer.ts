import getUrl from '@/utils/getUrl';
import { appRouter } from './root';
import { loggerLink } from '@trpc/client';
import { httpBatchLink } from '@trpc/client';

export const trpcS = appRouter.createCaller({
  // @ts-expect-error
  links: [
    loggerLink({
      enabled: () => true,
    }),

    httpBatchLink({
      url: getUrl('/api/trpc'),
    }),
  ],
});
