import { getUserName } from '@/utils/getUserFullName';
import { currentUser } from '@clerk/nextjs';
import { Avatar } from '@nextui-org/avatar';
import ProfileMenu from './ProfileMenu';

const Profile = async () => {
  const user = await currentUser();
  const { fullName, fallback } = getUserName(user?.firstName!, user?.lastName!);

  return (
    <>
      {user?.id && (
        <ProfileMenu>
          <Avatar
            size='sm'
            className='hidden cursor-pointer sm:block'
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
