import { userSession } from '@/services/auth.services';
import { getUserName } from '@/utils/getUserFullName';

import { Avatar } from '@nextui-org/avatar';
import ProfileMenu from './ProfileMenu';

const Profile = async () => {
  const user = await userSession();
  const { fullName, fallback } = getUserName(user?.firstName || '', user?.lastName || '');

  return (
    <>
      {user?.id && (
        <ProfileMenu>
          <Avatar
            size='sm'
            className='cursor-pointer xs:h-10 xs:w-10 sm:h-8 sm:w-fit'
            src={user?.imageUrl}
            name={fullName}
            fallback={fallback}
            alt='User Image'
          />
        </ProfileMenu>
      )}
    </>
  );
};

export default Profile;
