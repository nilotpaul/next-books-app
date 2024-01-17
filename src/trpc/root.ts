import { router } from './trpc';
import { testRouter } from './routers/testRouter';
import { authorRouter } from './routers/authorRouter';
import { bookRouter } from './routers/bookRouter';
import { userRouter } from './routers/userRouter';
import { forumPostRouter } from './routers/forumPostRouter';

export const appRouter = router({
  testRouter,
  userRouter,
  authorRouter,
  bookRouter,
  forumPostRouter,
});

export type AppRouter = typeof appRouter;
