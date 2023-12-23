import { router } from './trpc';
import { authorRouter } from './routers/authorRouter';

export const appRouter = router({
  authorRouter,
});

export type AppRouter = typeof appRouter;
