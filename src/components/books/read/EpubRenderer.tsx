'use client';

import { useMounted } from '@/hooks/useMounted';
import { Book } from 'epubjs';
import { useCallback, useEffect, useRef } from 'react';

type ReaderProps = {
  content: string[];
  options: {
    bookId: string;
    title: string;
    author: string;
    publisher: string;
    cover: string;
  };
};

const Reader = ({ content, options }: ReaderProps) => {
  const bookRef = useRef<Book | undefined>(undefined);

  const initReader = useCallback(async () => {
    const EpubGen = (await import('epub-gen-memory/bundle')).default;
    const Epub = (await import('epubjs')).default;

    const blob = await EpubGen(options, [
      {
        title: options.title,
        content: content.join(''),
      },
    ]);

    const arrayBuffer = await blob.arrayBuffer();

    if (!bookRef.current) {
      bookRef.current = Epub(arrayBuffer);

      // @ts-ignore isRendered is there
      if (!bookRef.current.isRendered) {
        bookRef.current.renderTo('reader', {
          resizeOnOrientationChange: true,
          infinite: true,
          allowScriptedContent: true,
          width: '100%',
          height: '100%',
          flow: 'scrolled-doc',
        });
        await bookRef.current.rendition.display();
      }
    }
  }, []);

  const [isMounted] = useMounted();

  useEffect(() => {
    const init = async () => {
      await initReader();
    };

    if (isMounted) {
      init();

      return () => {
        bookRef.current?.destroy();
        bookRef.current = undefined;
      };
    }
  }, [initReader, isMounted]);

  return <div id='reader' className='h-full w-full' />;
};

export default Reader;
