'use client';

import { Dot, Loader2, ThumbsUp } from 'lucide-react';
import { Card, CardHeader } from '@nextui-org/card';
import { ScrollShadow } from '@nextui-org/scroll-shadow';
import { Skeleton } from '@nextui-org/skeleton';
import Divider from '../ui/Divider';

const PostListSkeleton = ({ cards = 3 }: { cards?: number }) => {
  return Array(cards)
    .fill(0)
    .map((_, index) => (
      <>
        <Card
          key={index}
          radius='sm'
          isBlurred
          className='max-h-[30rem] min-h-[12rem] w-full border-0 text-foreground-600 outline-none dark:bg-foreground-50/60 dark:transition-all dark:duration-1000 dark:hover:opacity-90 md:w-3/4'
        >
          <ScrollShadow hideScrollBar className='overflow-hidden'>
            <CardHeader className='flex h-full w-full flex-col items-start gap-4 text-foreground-800'>
              <div className='flex w-full flex-col justify-between gap-2.5 truncate md:flex-row md:items-center md:gap-0'>
                <div className='flex flex-col gap-2 md:flex-row md:items-center'>
                  <Skeleton className='h-3 w-64 rounded-full' />
                  <Dot className='hidden md:block' />
                  <Skeleton className='h-2 w-32 rounded-full' />
                </div>

                <div className='flex items-center gap-3 text-danger'>
                  <ThumbsUp className='h-4 w-4 cursor-pointer' />
                  <Loader2 className='h-4 w-4 animate-spin' />
                </div>
              </div>

              <Skeleton className='h-[350px] w-full rounded-lg md:h-[450px]' />
            </CardHeader>
          </ScrollShadow>
        </Card>

        <Divider className='h-[0.5px] w-full rounded-full bg-foreground-100 md:w-3/4' />
      </>
    ));
};

export default PostListSkeleton;
