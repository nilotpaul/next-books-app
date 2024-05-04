import { db } from '@/lib/db/conn';
import { books, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { cache } from 'react';

import 'server-only';

export const getUserPurchases = cache(async (userId: string) => {
  const row = await db
    .select({
      userId: users.clerkId,
      stripeCustomerId: users.stripeCustomerId,
      purchasedBooks: users.purchasedBooks,
    })
    .from(users)
    .where(eq(users.clerkId, userId));

  if (!row || row.length === 0 || !row[0].userId) {
    return null;
  }

  return row[0];
});

export const getUserById = cache(async (userId: string) => {
  const row = await db.select().from(users).where(eq(users.clerkId, userId));

  if (!row[0]?.clerkId) {
    return null;
  }

  return row[0];
});

export async function createUser(user: (typeof users)['$inferInsert']) {
  const createdUser = await db.insert(users).values(user);

  if (createdUser[0].affectedRows === 0) {
    return null;
  }

  return createdUser;
}

export async function deleteUser(userId: string) {
  const deletedUser = await db.delete(users).where(eq(users.clerkId, userId));

  if (deletedUser[0].affectedRows === 0) {
    return null;
  }

  return deletedUser;
}

export async function updateUser(
  userId: string,
  user: Pick<(typeof users)['$inferInsert'], 'imageUrl' | 'username'>
) {
  const updatedUser = await db
    .update(users)
    .set({
      imageUrl: user.imageUrl,
      username: user.username,
    })
    .where(eq(users.clerkId, userId));

  if (!updatedUser) {
    return null;
  }

  return updatedUser;
}

export const purchaseBook = async ({
  bookId,
  userId,
  prevPurchasedBooks,
  prevPurchaseCount,
}: {
  bookId: string;
  userId: string;
  prevPurchasedBooks: string[];
  prevPurchaseCount: number;
}) => {
  const { success } = await db.transaction(async (tx) => {
    const purchasedBook = await db
      .update(users)
      .set({
        purchasedBooks: [...prevPurchasedBooks, bookId],
      })
      .where(eq(users.clerkId, userId));

    if (purchasedBook[0].affectedRows === 0) {
      tx.rollback();
      return { success: false };
    }

    const updateBookPurchaseCount = await db
      .update(books)
      .set({ purchaseCount: prevPurchaseCount + 1 })
      .where(eq(books.id, bookId));

    if (updateBookPurchaseCount[0].affectedRows === 0) {
      tx.rollback();
      return { success: false };
    }

    return { success: true };
  });

  if (!success) {
    return { success: false };
  }

  return { success: true };
};
