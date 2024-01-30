import { constructMetadata } from '@/lib/constructMetadata';
import { UserProfile } from '@clerk/nextjs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = constructMetadata({
  title: 'Profile',
  description: 'View and Edit your user profile.',
});

const ProfilePage = () => {
  return (
    <div className='flex w-full items-center justify-center'>
      <UserProfile />
    </div>
  );
};

export default ProfilePage;
