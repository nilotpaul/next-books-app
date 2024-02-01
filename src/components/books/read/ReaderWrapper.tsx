'use client';

import { useState } from 'react';
import { constructBookMetadata } from '@/lib/constructBookMetadata';
import { BookMetadata } from '@/types/book.types';

import Reader from './Reader';
import Container from '@/components/ui/Container';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/Carousel';

type ReaderWrapperProps = {
  chapters: {
    title: any;
    content: any;
  }[];
  metadata: BookMetadata;
  toc: any;
};

const ReaderWrapper = ({ chapters: initialChapters, metadata, toc }: ReaderWrapperProps) => {
  const bookMetadata = constructBookMetadata(metadata, toc);
  const [chapters] = useState<{ title: any; content: any }[]>([
    ...bookMetadata,
    ...initialChapters,
  ]);

  return (
    <div className='relative flex h-full items-center justify-center'>
      <Container className='mx-auto h-full w-full overflow-y-auto rounded-xl px-0 scrollbar-hide sm:max-w-3xl'>
        <Carousel>
          <CarouselContent>
            {chapters.map((chapter) => (
              <CarouselItem key={chapter.title}>
                <Reader content={chapter.content} illustration={chapter.title === 'illustration'} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            color='danger'
            className='absolute left-8 top-1/2 hidden -translate-y-1/2 lg:flex'
          />
          <CarouselNext
            color='danger'
            className='absolute right-8 top-1/2 hidden -translate-y-1/2 lg:flex'
          />
        </Carousel>
      </Container>
    </div>
  );
};

export default ReaderWrapper;
