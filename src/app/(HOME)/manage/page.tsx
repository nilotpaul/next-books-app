import { UserProfile } from '@clerk/nextjs';

const ManagePage = () => {
  return (
    <div className='flex w-full items-center justify-center'>
      <UserProfile />
    </div>
  );
};

export default ManagePage;
