'use client';

import { useEffect, useState } from 'react';

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/Carousel';
import Image from '@/components/ui/Image';
import { cn } from '@/utils/utils';

type BookInfoLeftProps = {
  frontArtwork: string;
  backArtwork: string;
  title: string;
  isLoading?: boolean;
};

const BookInfoLeft = ({ backArtwork, frontArtwork, title, isLoading }: BookInfoLeftProps) => {
  const [api, setApi] = useState<CarouselApi>(undefined);
  const [current, setCurrent] = useState(0);

  const carouselItems: { title: string; image: string }[] = [
    {
      title,
      image: frontArtwork,
    },
    {
      title,
      image: backArtwork,
    },
  ];

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Carousel setApi={setApi} className='w-full'>
      <CarouselContent className='rounded-md pl-4'>
        {carouselItems.map((item, index) => (
          <CarouselItem key={item.image} className='relative mx-auto min-h-[650px] w-full'>
            <Image
              src={item.image}
              alt={`${item.title} image ${index + 1}`}
              fill
              isLoading={isLoading}
              isBlurred
              radius='sm'
              className='h-full w-full rounded-md'
              classNames={{
                wrapper: 'rounded-md static',
                blurredImg: 'rounded-md scale-95',
                img: 'rounded-md',
              }}
            />
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className='mt-4 flex w-full items-center justify-center gap-6'>
        <CarouselPrevious disabled={current === 1} radius='none' size='sm' className='border-1' />
        {carouselItems.map((item, index) => (
          <div
            key={item.image}
            className={cn('relative h-[100px] w-[80px]', {
              'rounded-sm border-1 border-primary': current === index + 1,
            })}
          >
            <Image
              src={item.image}
              alt={`${item.title} image ${index + 1}`}
              fill
              radius='none'
              isLoading={isLoading}
              isBlurred
              onClick={() => api?.scrollTo(index)}
              classNames={{
                wrapper: 'static',
              }}
              className='h-full w-full cursor-pointer rounded-sm'
            />
          </div>
        ))}
        <CarouselNext disabled={current === 2} radius='none' size='sm' className='border-1' />
      </div>
    </Carousel>
  );
};

export default BookInfoLeft;
