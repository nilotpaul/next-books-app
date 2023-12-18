import { UserProfile } from '@clerk/nextjs';

const ProfilePage = () => {
  return (
    <div className='flex w-full items-center justify-center'>
      <UserProfile />
    </div>
  );
};

export default ProfilePage;
