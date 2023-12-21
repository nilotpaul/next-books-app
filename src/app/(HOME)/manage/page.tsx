import { userSession } from '@/services/auth.services';

import TabContent from '@/components/manage/TabContent';

const ManagePage = async () => {
  const { firstName, lastName, emailAddresses, username, imageUrl } = await userSession();

  return (
    <TabContent
      firstName={firstName!}
      lastName={lastName!}
      username={username!}
      email={emailAddresses[0].emailAddress}
      image={imageUrl}
    />
  );
};

export default ManagePage;
