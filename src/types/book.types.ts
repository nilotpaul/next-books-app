import { books } from '@/lib/db/schema';

export type Book = (typeof books)['$inferSelect'];

export type BooksWithoutNT = Omit<(typeof books)['$inferSelect'], 'normalised_title'>[];
