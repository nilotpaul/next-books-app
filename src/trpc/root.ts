import { router } from './trpc';
import { testRouter } from './routers/testRouter';
import { authorRouter } from './routers/authorRouter';

export const appRouter = router({
  testRouter,
  authorRouter,
});

export type AppRouter = typeof appRouter;
