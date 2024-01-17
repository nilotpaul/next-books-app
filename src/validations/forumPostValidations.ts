import { z } from 'zod';

export const forumPostValidation = z.object({
  id: z.string().min(2, { message: 'Enter a valid id' }),
  postTitle: z
    .string()
    .min(8, { message: 'Post title must be at least of 8 character(s)' })
    .max(70, {
      message: 'Post title must be lower than 70 character(s)',
    }),
  content: z.any(),
  image: z.string().url({ message: 'Enter a valid url' }).optional(),
  isAuthor: z.boolean().default(false),
  tags: z.array(z.string()),
});

export type ForumPost = z.infer<typeof forumPostValidation>;
