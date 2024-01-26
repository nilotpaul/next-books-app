import { useContext, useState } from 'react';
import { MyDashboardContext } from '../context/DashboardContext';
import { format } from 'date-fns';
import { trpc } from '@/lib/trpc/TRPCProvider';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { MAX_SEARCH_RESULTS_LIMIT } from '@/config/constants/search-filters';

import Divider from '../ui/Divider';
import Image from '../ui/Image';
import { Button } from '@nextui-org/button';
import { Eye, ImageOff, PenSquare, Trash2 } from 'lucide-react';
import ReusableTable from '../ReusableTable';
import { TableCell, TableRow } from '@nextui-org/table';
import Link from '../ui/Link';
import AlertDialog from '../ui/AlertDialog';

const ForumPostsTab = () => {
  const [isDeleting, setIsDeleting] = useState('');
  const {
    forumPosts: posts,
    user: { name: username, userImage, userId },
  } = useContext(MyDashboardContext);
  const utils = trpc.useUtils();
  const router = useRouter();

  const initialPosts = posts.map((post) => ({
    clerkId: post.userId,
    id: post.postId,
    createdAt: post.createdAt,
    image: post.postImage,
    postTitle: post.postTitle,
    content: '',
    firstName: '',
    lastName: '',
    likes: post.postLikes || [],
    tags: post.postTags || [],
  }));

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    trpc.forumPostRouter.getPosts.useInfiniteQuery(
      {
        limit: MAX_SEARCH_RESULTS_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        keepPreviousData: true,
        suspense: true,
        initialData: {
          pageParams: [undefined],
          pages: [
            {
              posts: initialPosts.slice(0, -1),
              nextCursor:
                initialPosts.length > MAX_SEARCH_RESULTS_LIMIT
                  ? initialPosts.slice(-1)[0].id
                  : undefined,
              lastItem: initialPosts.slice(-1)[0],
            },
          ],
        },
      }
    );

  const { mutate: deletePost, isLoading } = trpc.forumPostRouter.delete.useMutation({
    onMutate: ({ postId }) => setIsDeleting(postId),
    onSuccess: ({ success }) => {
      if (success) {
        toast.success('Post deleted');
      }
      router.refresh();
      utils.forumPostRouter.getPosts.refetch();
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });

  const newPosts = data?.pages.flatMap((page) => page.posts) || [];
  const uniqueBookIds = new Set(newPosts.map((post) => post.id));
  data?.pages.flatMap(({ lastItem }) => {
    if (!hasNextPage && lastItem?.id && !uniqueBookIds.has(lastItem.id)) {
      newPosts.push(lastItem);
    }
  });

  return (
    <div className='relative'>
      <header className='flex flex-col items-end justify-center space-y-1.5 pb-3'>
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Image
              src={userImage}
              alt={username}
              fill
              radius='full'
              classNames={{ wrapper: 'min-h-[30px] min-w-[30px]' }}
              className='object-cover'
            />
            <p className='truncate text-sm font-medium xs:text-base sm:text-sm'>{username}</p>
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
        rows={[...newPosts]
          .filter((post, idx, self) => idx === self.findIndex((b) => b.id === post.id))
          .map((post) => ({
            id: post.id,
            thumbnail: post.image,
            title: post.postTitle,
            likes: post.likes?.length || 0,
            createdOn: post.createdAt,
            tags: post.tags || [],
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
                  className='rounded-md object-cover'
                />
              ) : (
                <span className='flex h-[60px] w-[50px] items-center justify-center rounded-md'>
                  <ImageOff className='h-8 w-8 text-foreground-400' />
                </span>
              )}
            </TableCell>
            <TableCell className='text-sm font-medium sm:text-base'>{item.title}</TableCell>
            <TableCell className='whitespace-nowrap text-base'>
              {format(item.createdOn, 'dd / MM / yy')}
            </TableCell>
            <TableCell className='text-base text-danger'>{item.likes}</TableCell>
            <TableCell className='text-base'>
              <div className='flex w-full items-center gap-3'>
                <Link
                  // href={`/forum/post/${item.id}`} i'll add a dedicated post page maybe
                  href={`/forum/posts#${item.title.replace(' ', '').toLowerCase()}`}
                >
                  <Eye className='h-5 w-5 scale-95 cursor-pointer text-default-400 active:opacity-50' />
                </Link>
                <Button
                  isLoading={isLoading && isDeleting === item.id}
                  isIconOnly
                  className='m-0 block min-w-min max-w-min gap-0 bg-transparent p-0'
                >
                  <AlertDialog
                    trigger={
                      <Trash2 className='h-5 w-5 scale-95 cursor-pointer text-danger active:opacity-50' />
                    }
                    headerContent='Are you are?'
                    bodyContent='This action cannot be undone. This will delete the post permanently.'
                    footerContent={
                      <Button
                        isDisabled={isLoading}
                        onClick={() => deletePost({ postId: item.id })}
                        className='font-medium'
                        color='danger'
                      >
                        Delete
                      </Button>
                    }
                  />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )}
      />

      {hasNextPage && (
        <Button
          isLoading={isFetchingNextPage}
          onClick={() => hasNextPage && fetchNextPage()}
          size='sm'
          className='absolute right-0 mt-2 font-medium'
        >
          Load more
        </Button>
      )}
    </div>
  );
};

export default ForumPostsTab;
