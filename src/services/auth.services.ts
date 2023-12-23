import { currentUser } from '@clerk/nextjs';
import { cache } from 'react';

import 'server-only';

export const userSession = cache(async () => {
  try {
    const user = await currentUser();

    return user;
  } catch (err) {
    console.error('No User Session', err);
  }
});
