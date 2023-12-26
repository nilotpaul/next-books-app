import { userSession } from '@/services/auth.services';
import { User } from '@clerk/nextjs/server';
import { getAuthorByIdWithLinks } from '@/services/author.services';

import TabContent from '@/components/manage/TabContent';

const ManagePage = async () => {
  const {
    id: userId,
    firstName,
    lastName,
    emailAddresses,
    username,
    imageUrl,
  } = (await userSession()) as User;
  const { isAuthor, author, links } = await getAuthorByIdWithLinks(userId);

  return (
    <TabContent
      firstName={firstName!}
      lastName={lastName!}
      username={username!}
      email={emailAddresses[0].emailAddress}
      image={imageUrl}
      isAuthor={isAuthor}
      author={author}
      links={links}
    />
  );
};

export default ManagePage;
