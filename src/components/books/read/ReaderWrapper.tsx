'use client';

import { useState } from 'react';
import { constructBookMetadata } from '@/lib/constructBookMetadata';
import { BookMetadata } from '@/types/book.types';

import Reader from './Reader';
import Container from '@/components/ui/Container';
import { Button } from '@nextui-org/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

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
  const [chapterIndex, setChapterIndex] = useState(0);

  return (
    <div className='relative flex h-full md:h-[calc(100vh-1.5rem)]'>
      <Button
        onClick={() => {
          chapterIndex <= chapters.length && chapterIndex !== 0
            ? setChapterIndex((prev) => prev - 1)
            : setChapterIndex(chapters.length - 1);
        }}
        isIconOnly
        className='-translate-1/2 absolute left-0 top-1/2 ml-8 hidden md:flex'
      >
        <ArrowLeft />
      </Button>

      <Container className='h-full w-full overflow-y-auto rounded-xl px-0 scrollbar-hide sm:max-w-3xl'>
        <Reader
          content={chapters[chapterIndex].content}
          setChapterIndex={setChapterIndex}
          chapters={chapters}
        />
      </Container>

      <Button
        onClick={() => {
          chapterIndex < chapters.length - 1
            ? setChapterIndex((prev) => prev + 1)
            : setChapterIndex(0);
        }}
        isIconOnly
        className='-translate-1/2 absolute right-0 top-1/2 mr-8 hidden md:flex'
      >
        <ArrowRight />
      </Button>
      {/* 
      <p className='absolute bottom-20 left-1/2 -translate-x-1/2 rounded-lg bg-foreground-50/80 p-1.5 text-sm font-medium md:bottom-0'>
        Chapter {chapterIndex} / {chapters.length - 1}
      </p> */}
    </div>
  );
};

export default ReaderWrapper;
