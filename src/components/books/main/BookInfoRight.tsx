'use client';

import { format } from 'date-fns';

import Divider from '@/components/ui/Divider';
import { BookInfo } from '@/types/book.types';
import { Button } from '@nextui-org/button';
import { Accordion, AccordionItem } from '@nextui-org/accordion';
import Link from '@/components/ui/Link';
import Stars from './Stars';

type BookInfoRight = {
  book: BookInfo;
};

const BookInfoRight = ({ book }: BookInfoRight) => {
  return (
    <div className='h-full w-full space-y-4'>
      <div className='space-y-2'>
        <h2 className='text-2xl font-bold'>{book?.title}</h2>
        <p className='truncate pb-4'>by {book?.authorName}</p>
        <Divider className='h-[1px]' />
      </div>

      <div className='flex flex-col gap-4'>
        <span className='text-foreground-500'>Price: $ {book?.pricing || '00.00'}</span>
        <div className='mb-2 flex items-center gap-1.5'>
          <Stars stars={book?.stars || 0} />
        </div>

        <div className='space-y-2 text-sm'>
          <div className='flex items-center gap-1'>
            Genres:
            <p>
              {book?.genres?.map((genre, index) => {
                if (index === book.genres!.length - 1) {
                  return genre;
                }
                return genre + ',' + ' ';
              })}
            </p>
          </div>

          <p>Language: {book?.language}</p>
          <p>
            Published: From {format(book?.publicationDate!, 'do, MMM, yyyy')} to{' '}
            {format(book?.updatedAt!, 'do, MMM, yyyy')}
          </p>
          <p>{book?.collaborations?.toString() || 'collab'}</p>
          <p>{book?.series.toString() || 'series'}</p>
        </div>
      </div>

      <div className='flex items-center gap-4 pt-4'>
        <Button
          as={Link}
          href={`/books/read/${book?.id}`}
          className='bg-foreground-800 font-medium text-black'
          variant='solid'
        >
          Read Now
        </Button>
        <Button variant='bordered' className='font-medium text-danger'>
          Buy Now
        </Button>
      </div>
      <Divider className='h-[1px]' />

      <Accordion
        className='px-0'
        defaultExpandedKeys={['1']}
        itemClasses={{ title: 'text-md font-medium' }}
      >
        <AccordionItem key='1' aria-label='Book Description' title='Book Description'>
          synopsis
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default BookInfoRight;
