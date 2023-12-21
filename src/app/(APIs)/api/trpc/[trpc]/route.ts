import { appRouter } from '@/trpc/root';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createContext } from '@/trpc/context';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => {
      return createContext({
        req,
        resHeaders: req.headers,
      });
    },
    onError:
      process.env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(`TrpcError on ${path ?? 'no-path'}: ${error.message}`);
          }
        : undefined,
  });

export { handler as GET, handler as POST };
