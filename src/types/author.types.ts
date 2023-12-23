import { bookGenres } from '@/config/constants/author';
import { authors } from '@/lib/db/schema';

export type Author = (typeof authors)['$inferSelect'];

export type BookGenres = (typeof bookGenres)[number][];
