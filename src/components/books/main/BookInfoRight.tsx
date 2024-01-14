'use client';

import { format } from 'date-fns';
import { convertPrice } from '@/utils/utils';

import Divider from '@/components/ui/Divider';
import { BookInfo } from '@/types/book.types';
import { Button } from '@nextui-org/button';
import { Accordion, AccordionItem } from '@nextui-org/accordion';
import Link from '@/components/ui/Link';
import Stars from './Stars';
import PurchaseBook from '../PurchaseBook';

type BookInfoRight = {
  book: NonNullable<BookInfo>;
  isPurchased: boolean;
};

const BookInfoRight = ({ book, isPurchased }: BookInfoRight) => {
  return (
    <div className='h-full w-full space-y-4'>
      <div className='space-y-2'>
        <h2 className='text-2xl font-bold'>{book.title}</h2>
        <p className='truncate pb-4'>by {book.authorName}</p>
        <Divider className='h-[1px] bg-foreground-400' />
      </div>

      <div className='flex flex-col gap-4'>
        <span className='text-foreground-500'>Price: {convertPrice(book.pricing || '00.00')}</span>
        <div className='mb-2 flex items-center gap-1.5'>
          <Stars stars={book.stars || 0} bookId={book.id} />
        </div>

        <div className='space-y-2 text-sm'>
          <div className='flex items-center gap-1'>
            <span className='font-semibold text-primary'>Genres:</span>
            <p className='text-foreground-700'>
              {book.genres!.map((genre, index) => {
                if (index === book.genres!.length - 1) {
                  return genre;
                }
                return genre + ',' + ' ';
              })}
            </p>
          </div>

          <p className='text-foreground-700'>
            <span className='font-semibold text-primary'>Language:</span> {book?.language}
          </p>
          <p className='text-foreground-700'>
            <span className='font-semibold text-primary'>Published:</span>{' '}
            {format(book?.publicationDate!, 'do, MMM, yyyy')}{' '}
          </p>
          {book.collaborations?.length !== 0 && (
            <p className='text-foreground-700'>
              <span className='font-semibold text-primary'>Collaborations: </span>
              {book.collaborations?.map((item, index) => {
                if (index === book.collaborations!.length - 1) {
                  return item;
                }
                return item + ',' + ' ';
              })}
            </p>
          )}
          {book.series?.length !== 0 && (
            <p className='text-foreground-700'>
              <span className='font-semibold text-primary'>Related:</span>{' '}
              {book.series?.map((item, index) => {
                if (index === book.series.length - 1) {
                  return item;
                }
                return item + ',' + ' ';
              })}
            </p>
          )}
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
        {!isPurchased && (
          <PurchaseBook bookId={book?.id!} variant='bordered' className='font-medium text-danger'>
            Buy Now
          </PurchaseBook>
        )}
      </div>
      <Divider className='h-[1px] bg-foreground-400' />

      <Accordion
        className='px-0'
        defaultExpandedKeys={['1']}
        itemClasses={{ title: 'text-md font-medium' }}
      >
        <AccordionItem
          className='text-sm leading-7'
          key='1'
          aria-label='Book Description'
          title='Book Description'
        >
          {book?.synopsis}
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default BookInfoRight;
