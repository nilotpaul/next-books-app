import { currentUser } from '@clerk/nextjs';
import { cache } from 'react';

import 'server-only';

export const userSession = cache(async () => {
  const user = await currentUser();

  return user;
});
