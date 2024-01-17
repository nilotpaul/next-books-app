import { useContext } from 'react';
import { MyDashboardContext } from '../context/DashboardContext';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

import Divider from '../ui/Divider';
import Image from '../ui/Image';
import { Button } from '@nextui-org/button';
import { ImageOff, PenSquare } from 'lucide-react';
import ReusableTable from '../ReusableTable';
import { TableCell, TableRow } from '@nextui-org/table';

const ForumPostsTab = () => {
  const {
    forumPosts: posts,
    user: { name: username, userImage, userId },
  } = useContext(MyDashboardContext);
  const router = useRouter();

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
            <Button
              onClick={() => {
                router.push(`/forum/post/${userId}/create`);
              }}
              className='gap-1.5 text-sm font-semibold'
              startContent={<PenSquare className='h-4 w-4' />}
              size='sm'
              color='success'
            >
              Create Post
            </Button>
          </div>

          <Divider className='h-[1px] rounded-md bg-default' />
        </header>

        <ReusableTable
          type='Post'
          columns={['Thumbnail', 'Title', 'Created On', 'Likes', 'Options']}
          rows={posts.map((post) => ({
            id: post.postId,
            thumbnail: post.postImage,
            title: post.postTitle,
            likes: 0,
            createdOn: post.createdAt,
          }))}
          map={(item) => (
            <TableRow key={item.id}>
              <TableCell>
                {item.thumbnail ? (
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    classNames={{
                      wrapper: 'min-h-[60px] min-w-[50px]',
                    }}
                    radius='none'
                    className='rounded-md'
                  />
                ) : (
                  <ImageOff className='h-7 w-7 text-foreground-400' />
                )}
              </TableCell>
              <TableCell className='text-base'>{item.title}</TableCell>
              <TableCell className='text-base'>{format(item.createdOn, 'dd / MM / yy')}</TableCell>
              <TableCell className='text-base text-danger'>{item.likes || 0}</TableCell>
              <TableCell className='text-base'>
                <Button
                  onClick={() => router.push(`/forum/post/${item.id}`)}
                  color='success'
                  className='font-medium'
                >
                  Read
                </Button>
              </TableCell>
            </TableRow>
          )}
        />
      </>
    </div>
  );
};

export default ForumPostsTab;
