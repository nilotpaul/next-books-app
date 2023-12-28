import { bookGenres } from '@/config/constants/author';
import { BOOK_AVAILABALITY, BOOK_LANGUAGES, BOOK_STATUS } from '@/config/constants/books';
import { z } from 'zod';

export const createBookValidation = z.object({
  bookTitle: z
    .string({
      invalid_type_error: 'Only string is allowed',
    })
    .min(2, {
      message: 'Title must be more than 2 character(s)',
    })
    .max(70, { message: 'Title cannot be more than 70 character(s)' }),
  language: z.enum(BOOK_LANGUAGES, {
    errorMap: (err) => ({
      message: err.message || 'Choose language from the menu',
    }),
  }),
});

export const publishBookValidation = z.object({
  bookTitle: z
    .string({
      invalid_type_error: 'Only string is allowed',
    })
    .min(2, {
      message: 'Title must be more than 2 character(s)',
    })
    .max(70, { message: 'Title cannot be more than 70 character(s)' }),
  content: z.unknown(),
  frontArtwork: z.string().url().min(2),
  backArtwork: z.string().url().min(2),
  status: z.enum(BOOK_STATUS, {
    errorMap: (err) => ({ message: err.message || 'Select status from the menu' }),
  }),
  genres: z.array(
    z.enum(bookGenres, {
      errorMap: (err) => ({ message: err.message || 'Select genres from the menu' }),
    }),
    {
      errorMap: (err) => ({ message: err.message || 'Select genres from menu' }),
    }
  ),
  language: z.enum(BOOK_LANGUAGES, {
    errorMap: (err) => ({
      message: err.message || 'Choose language from the menu',
    }),
  }),
  availability: z.enum(BOOK_AVAILABALITY, {
    errorMap: (err) => ({ message: err.message || 'Select availability from the menu' }),
  }),
  pricing: z.number(),
  series: z.string().min(1),
  collaborations: z.array(z.string(), {
    errorMap: (err) => ({ message: err.message || 'Input a list of collaborators' }),
  }),
});

export type CreateBook = z.infer<typeof createBookValidation>;
export type PublishBook = z.infer<typeof publishBookValidation>;
