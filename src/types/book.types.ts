import { books } from '@/lib/db/schema';

export type Book = (typeof books)['$inferSelect'];
