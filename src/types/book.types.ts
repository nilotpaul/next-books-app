import { books } from '@/lib/db/schema';

export type Book = (typeof books)['$inferSelect'];

export type BooksWithoutNT = Omit<(typeof books)['$inferSelect'], 'normalised_title'>[];

export type BookMetadata = {
  bookId: string;
  title: string;
  author: string;
  publisher: string;
  cover: string;
};

export type PublishedBook = {
  id: string;
  title: string;
  availability: 'Free' | 'Paid' | null;
  artwork: string | null;
  price: string | null;
};