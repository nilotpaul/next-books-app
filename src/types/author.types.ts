import { bookGenres } from '@/config/constants/author';
import { authors, socialLinks } from '@/lib/db/schema';
import { getAuthorWithBooksById } from '@/services/author.services';

export type Author = (typeof authors)['$inferSelect'];

export type BookGenres = (typeof bookGenres)[number][];

export type SocialLinks = (typeof socialLinks)['$inferSelect'];

export type AuthorWithBooks = Awaited<ReturnType<typeof getAuthorWithBooksById>>;
