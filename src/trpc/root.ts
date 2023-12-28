import { router } from './trpc';
import { testRouter } from './routers/testRouter';
import { authorRouter } from './routers/authorRouter';
import { bookRouter } from './routers/bookRouter';

export const appRouter = router({
  testRouter,
  authorRouter,
  bookRouter,
});

export type AppRouter = typeof appRouter;
