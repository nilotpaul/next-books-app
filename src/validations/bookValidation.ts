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
  bookId: z.string().min(1),
  bookTitle: z
    .string({
      invalid_type_error: 'Only string is allowed',
    })
    .min(2, {
      message: 'Title must be more than 2 character(s)',
    })
    .max(70, { message: 'Title cannot be more than 70 character(s)' }),
  content: z.any(),
  frontArtwork: z.string().url().min(2),
  backArtwork: z.string().url().min(2),
  status: z.enum(BOOK_STATUS, {
    errorMap: (err) => ({ message: err.message || 'Select status from the menu' }),
  }),
  genres: z
    .array(
      z.enum(bookGenres, {
        errorMap: (err) => ({ message: err.message || 'Select genres from the menu' }),
      }),
      {
        errorMap: (err) => ({ message: err.message || 'Select genres from menu' }),
      }
    )
    .refine((genres) => genres.length !== 0),
  language: z.enum(BOOK_LANGUAGES, {
    errorMap: (err) => ({
      message: err.message || 'Choose language from the menu',
    }),
  }),
  availability: z.enum(BOOK_AVAILABALITY, {
    errorMap: (err) => ({ message: err.message || 'Select availability from the menu' }),
  }),
  pricing: z.string(),
  series: z
    .array(z.string(), {
      errorMap: (err) => ({ message: err.message || 'Input a list of series' }),
    })
    .optional(),
  collaborations: z
    .array(z.string(), {
      errorMap: (err) => ({ message: err.message || 'Input a list of collaborators' }),
    })
    .optional(),
});

export const draftBookValidation = z.object({
  bookId: z.string().min(1),
  bookTitle: z
    .string({
      invalid_type_error: 'Only string is allowed',
    })
    .min(2, {
      message: 'Title must be more than 2 character(s)',
    })
    .max(70, { message: 'Title cannot be more than 70 character(s)' }),
  content: z.any().optional(),
  frontArtwork: z.string().url().min(2).optional(),
  backArtwork: z.string().url().min(2).optional(),
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
  availability: z
    .enum(BOOK_AVAILABALITY, {
      errorMap: (err) => ({ message: err.message || 'Select availability from the menu' }),
    })
    .optional(),
  pricing: z.string().optional(),
  series: z
    .array(z.string(), {
      errorMap: (err) => ({ message: err.message || 'Input a list of series' }),
    })
    .optional(),
  collaborations: z
    .array(z.string(), {
      errorMap: (err) => ({ message: err.message || 'Input a list of collaborators' }),
    })
    .optional(),
});

export const bookFilterValidation = z.object({
  genres: z.array(z.string()).optional(),
  authorName: z.string().optional(),
  publication: z.number().optional(),
  rating: z.number().optional(),
  price: z.string().optional(),
  language: z.enum(BOOK_LANGUAGES).optional(),
  series: z.string().optional(),
  availability: z.enum(BOOK_AVAILABALITY).optional(),
  q: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.number().min(1).max(100).optional(),
});

export type CreateBook = z.infer<typeof createBookValidation>;
export type PublishBook = z.infer<typeof publishBookValidation>;
export type DraftBook = z.infer<typeof draftBookValidation>;
export type BookFilters = z.infer<typeof bookFilterValidation>;
