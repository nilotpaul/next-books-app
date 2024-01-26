import { UserProfile } from '@clerk/nextjs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const ProfilePage = () => {
  return (
    <div className='flex w-full items-center justify-center'>
      <UserProfile />
    </div>
  );
};

export default ProfilePage;
