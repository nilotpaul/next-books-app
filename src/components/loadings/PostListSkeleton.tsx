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
          className='max-h-[30rem] min-h-[12rem] w-3/4 border-0 text-foreground-600 outline-none dark:bg-foreground-50/60'
        >
          <ScrollShadow hideScrollBar className='overflow-hidden'>
            <CardHeader className='flex h-full w-full flex-col items-start gap-4 text-foreground-800'>
              <div className='flex w-full items-center justify-between truncate'>
                <div className='space-y-1'>
                  <div className='flex items-center'>
                    <Skeleton className='h-3 w-64 rounded-full' />
                    <Dot />

                    <Skeleton className='h-2 w-24 rounded-full' />
                  </div>
                  <Skeleton className='h-2 w-32 rounded-full' />
                </div>

                <div className='flex items-center gap-3 text-danger'>
                  <ThumbsUp className='h-4 w-4 cursor-pointer' />
                  <Loader2 className='h-4 w-4 animate-spin' />
                </div>
              </div>

              <Skeleton className='h-[450px] w-full rounded-lg' />
            </CardHeader>
          </ScrollShadow>
        </Card>

        <Divider className='h-[0.5px] w-3/4 rounded-full bg-foreground-100' />
      </>
    ));
};

export default PostListSkeleton;
