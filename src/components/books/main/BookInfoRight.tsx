'use client';

import { format } from 'date-fns';
import { calculateAverageRating, convertPrice, renderArrayItemsByComma } from '@/utils/utils';

import Divider from '@/components/ui/Divider';
import { BookInfo } from '@/types/book.types';
import { Button } from '@nextui-org/button';
import { Accordion, AccordionItem } from '@nextui-org/accordion';
import Link from '@/components/ui/Link';
import Stars from './Stars';
import PurchaseBook from '../PurchaseBook';
import { Chip } from '@nextui-org/react';

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
        <span className='font-medium text-danger'>
          {book.availability === 'Paid' ? (
            <>Price: {convertPrice(book.pricing || '00.00')}</>
          ) : (
            <Chip color='danger'>Free</Chip>
          )}
        </span>
        <div className='mb-2 flex items-center gap-1.5'>
          <Stars
            displayOnly
            stars={calculateAverageRating({
              rating: book.stars || 0,
              ratingCount: book.ratedBy || 0,
              scale: 5,
            })}
            bookId={book.id}
          />
          <span className='ml-4 text-xs text-foreground-600'>Rated By: {book.ratedBy}</span>
        </div>
        <div className='space-y-2 text-sm'>
          <div className='flex gap-1.5'>
            <span className='font-semibold text-primary'>Genres:</span>
            <p className='line-clamp-2 text-foreground-700'>
              {renderArrayItemsByComma(book.genres || [])}
            </p>
          </div>

          <p className='text-foreground-700'>
            <span className='font-semibold text-primary'>Language:</span> {book?.language}
          </p>
          <p className='text-foreground-700'>
            <span className='font-semibold text-primary'>Published:</span>{' '}
            {format(book?.publicationDate!, 'do MMM, yyyy')}
          </p>
          {book.collaborations?.length !== 0 && (
            <p className='text-foreground-700'>
              <span className='font-semibold text-primary'>Collaborations: </span>
              {renderArrayItemsByComma(book.collaborations!)}
            </p>
          )}
          {book.series?.length !== 0 && (
            <p className='text-foreground-700'>
              <span className='font-semibold text-primary'>Related:</span>{' '}
              {renderArrayItemsByComma(book.series)}
            </p>
          )}
        </div>
      </div>

      <div className='flex items-center gap-4 pt-4'>
        <Button
          as={Link}
          href={`/books/read/${book.id}`}
          className='font-medium text-black dark:bg-foreground-800'
          variant='solid'
        >
          Read Now
        </Button>
        {!isPurchased && book.availability === 'Paid' && (
          <PurchaseBook bookId={book.id} variant='bordered' className='font-medium text-danger'>
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
          {book.synopsis}
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default BookInfoRight;
