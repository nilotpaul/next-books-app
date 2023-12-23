'use server';

import { userSession } from './services/auth.services';
import { createUser } from './services/user.services';

// just for testing with db

export async function manuallyCreateUser() {
  const loggedUser = (await userSession())!;

  const user = await createUser({
    clerkId: loggedUser.id,
    email: loggedUser.emailAddresses[0].emailAddress,
    firstName: loggedUser.firstName!,
    lastName: loggedUser.lastName!,
    strategy: loggedUser.emailAddresses[0].verification!.strategy,
    imageUrl: loggedUser.imageUrl,
    username: loggedUser.username,
    updatedAt: new Date(),
  });

  console.log('status:', user?.rowsAffected);
}
