import { db } from '@/lib/db/conn';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function createUser(user: (typeof users)['$inferInsert']) {
  const createdUser = await db.insert(users).values(user);

  console.log(createUser);

  if (!createdUser) {
    return null;
  }

  return createdUser;
}

export async function deleteUser(userId: string) {
  const deletedUser = await db.delete(users).where(eq(users.clerkId, userId));

  if (!deletedUser) {
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
