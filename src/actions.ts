'use server';

import { userSession } from './services/auth.services';
import { registerAuthor } from './services/author.services';

export async function testAction() {
  const user = await userSession();
  const data = await registerAuthor(
    {
      artistGenres: ['Fantasy'],
      authorName: 'Dexter',
      bio: '',
      clerkId: user?.id ?? '',
      confirm_email: user?.emailAddresses[0].emailAddress ?? 'nilotpaul.nandi007@gmail.com',
      secretKey: '',
      author_image: '',
    },
    {
      html: '',
      subject: '',
      to: '',
      username: '',
    }
  );

  return data;
}
