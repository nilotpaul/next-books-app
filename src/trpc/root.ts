import { router } from './trpc';
import { testRouter } from './routers/testRouter';
import { authorRouter } from './routers/authorRouter';
import { bookRouter } from './routers/bookRouter';
import { userRouter } from './routers/userRouter';

export const appRouter = router({
  testRouter,
  userRouter,
  authorRouter,
  bookRouter,
});

export type AppRouter = typeof appRouter;
