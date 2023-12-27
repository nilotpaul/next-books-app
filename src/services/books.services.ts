import { db } from '@/lib/db/conn';
import { books } from '@/lib/db/schema';

export const createBooks = async () => {
  // creating book as draft
  const create = await db.insert(books).values({
    id: '',
    clerkId: '',
    bookName: '',
    language: 'English',
    status: 'draft',
  });
};
