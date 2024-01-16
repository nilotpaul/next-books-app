import { useContext } from 'react';
import { MyDashboardContext } from '../context/DashboardContext';

import Divider from '../ui/Divider';
import Image from '../ui/Image';

const ForumPosts = () => {
  const {
    forumPosts: posts,
    user: { name: username, userImage },
  } = useContext(MyDashboardContext);

  return (
    <div>
      <>
        <header className='flex flex-col items-end justify-center space-y-1.5 pb-3'>
          <div className='flex w-full items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Image
                src={userImage}
                alt={username}
                fill
                isBlurred
                radius='full'
                classNames={{ wrapper: 'min-h-[30px] min-w-[30px]' }}
              />
              <p className='text-sm'>{username}</p>
            </div>
            {/* modal */}
          </div>

          <Divider className='h-[1px] rounded-md bg-default' />
        </header>

        {posts.length > 0 && 'posts list'}
      </>
    </div>
  );
};

export default ForumPosts;
