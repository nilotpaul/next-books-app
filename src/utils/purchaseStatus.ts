import { userSession } from '@/services/auth.services';
import { getUserPurchases } from '@/services/user.services';
import { User } from '@clerk/nextjs/server';
import { cache } from 'react';

export const purchaseStatus = cache(async (bookId: string) => {
  const user = (await userSession()) as User;
  const purchasedBooks = await getUserPurchases(user.id);

  if (!purchasedBooks?.purchasedBooks?.includes(bookId)) {
    return { isPurchased: false, userId: user.id };
  }

  return { isPurchased: true, userId: user.id };
});
