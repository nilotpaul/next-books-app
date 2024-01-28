import { appRouter } from '@/trpc/root';
import { createTRPCContext } from '@/trpc/trpc';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { NextRequest } from 'next/server';

export const runtime = 'edge';
export const preferredRegion = ['sin1', 'cle1'];

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: (opts) =>
      createTRPCContext({
        req,
        resHeaders: opts.resHeaders,
      }),
    onError:
      process.env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(`TrpcError on ${path ?? 'no-path'}: ${error.message}`);
          }
        : undefined,
  });

export { handler as GET, handler as POST };
