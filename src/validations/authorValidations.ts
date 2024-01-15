import { bookGenres } from '@/config/constants/author';
import { z } from 'zod';

export const registerAuthorValidation = z.object({
  authorName: z
    .string({
      invalid_type_error: 'Only string is allowed',
      required_error: 'Author name required',
    })
    .min(2, { message: 'Min 2 characters required' }),
  bio: z
    .string({
      invalid_type_error: 'Only string is allowed',
      required_error: 'Bio required',
    })
    .min(20, { message: 'Min 20 characters required' }),
  imageUrl: z.string().url().min(1),
  genres: z.array(
    z.enum(bookGenres, {
      errorMap: (err) => ({ message: err.message || 'Choose from the genre menu' }),
    })
  ),
  confirm_email: z
    .string({
      invalid_type_error: 'Only email is allowed',
      required_error: 'Email is required',
    })
    .email({
      message: 'Only email is allowed',
    })
    .min(1),
});

export const verifyAuthorValidation = z.object({
  secretKey: z
    .string({
      invalid_type_error: 'Only string is allowed',
      required_error: 'Secret Key required',
    })
    .min(2, { message: 'Min 2 characters required' }),
});

export const updateAuthorProfileValidation = z.object({
  authorName: z
    .string({
      invalid_type_error: 'Only string is allowed',
      required_error: 'Author name required',
    })
    .min(2, { message: 'Min 2 characters required' })
    .optional(),
  authorImage: z
    .string()
    .url({
      message: 'Enter a valid url',
    })
    .optional(),
  bio: z
    .string({
      invalid_type_error: 'Only string is allowed',
      required_error: 'Bio required',
    })
    .min(20, { message: 'Min 20 characters required' })
    .optional(),
  genres: z.array(z.enum(bookGenres)).optional(),
  links: z.object({
    instagram: z.string().url({ message: 'Enter a valid link' }).optional(),
    Twitter: z.string().url({ message: 'Enter a valid link' }).optional(),
  }),
});

export type RegisterAuthor = z.infer<typeof registerAuthorValidation>;
export type VerifyAuthor = z.infer<typeof verifyAuthorValidation>;
export type UpdateAuthorProfile = z.infer<typeof updateAuthorProfileValidation>;
