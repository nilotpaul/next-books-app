import { bookGenres } from '@/config/constants/author';
import { authors, socialLinks } from '@/lib/db/schema';

export type Author = (typeof authors)['$inferSelect'];

export type BookGenres = (typeof bookGenres)[number][];

export type SocialLinks = (typeof socialLinks)['$inferSelect'];
