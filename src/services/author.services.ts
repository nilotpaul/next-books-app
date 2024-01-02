import { db } from '@/lib/db/conn';
import { authors, books, socialLinks, users } from '@/lib/db/schema';
import { env } from '@/validations/env';
import { eq } from 'drizzle-orm';
import { cache } from 'react';

export const getAuthorWithBooksById = cache(async (userId: string) => {
  const row = await db
    .select()
    .from(authors)
    .where(eq(authors.clerkId, userId))
    .leftJoin(books, eq(books.clerkId, userId));

  const allBooks = row.map((book) => book.books);

  if (row.length === 0 || !row[0].authors.isConfirmed || !row[0].books?.id) {
    return {
      isAuthor: false,
      author: row[0].authors,
      books: allBooks,
    };
  }

  return { isAuthor: true, author: row[0].authors, books: allBooks };
});

export const getAuthorById = cache(async (userId: string) => {
  const author = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, userId))
    .leftJoin(authors, eq(authors.clerkId, userId));

  if (!author || author.length === 0 || !author[0].users.isAuthor) {
    return {
      isAuthor: false,
      user: author[0].users,
      author: author[0].authors,
    };
  }

  return {
    isAuthor: author[0].users.isAuthor,
    user: author[0].users,
    author: author[0].authors,
  };
});

export const getAuthorByIdWithLinks = cache(async (userId: string) => {
  const row = await db
    .select()
    .from(authors)
    .where(eq(authors.clerkId, userId))
    .leftJoin(socialLinks, eq(socialLinks.clerkId, userId));

  if (!row[0].authors || !row[0].authors.isConfirmed) {
    return {
      isAuthor: false,
      author: null,
      links: null,
    };
  }

  return {
    isAuthor: row[0].authors.isConfirmed,
    author: row[0].authors,
    links: row[0].social_links,
  };
});

export async function verifyAuthor(userId: string) {
  await db.transaction(async (tx) => {
    const author = await tx
      .update(authors)
      .set({ isConfirmed: true })
      .where(eq(authors.clerkId, userId));

    if (!author || author.rowsAffected === 0) {
      tx.rollback();
      return { success: false };
    }

    const user = await tx.update(users).set({ isAuthor: true }).where(eq(users.clerkId, userId));

    if (!user || user.rowsAffected === 0) {
      tx.rollback();
      return { success: false };
    }
  });

  return { success: true };
}

export async function sendEmail({
  to,
  subject,
  username,
  html,
}: {
  to: string;
  subject: string;
  username: string;
  html: string;
}) {
  const headers = {
    'Content-Type': 'application/json',
    'api-key': env.BREVO_API_KEY,
  };

  const body = {
    sender: {
      name: 'Nilotpaul Nandi',
      email: env.ADMIN_EMAIL,
    },
    to: [
      {
        email: to,
        name: username,
      },
    ],
    subject,
    htmlContent: html,
  };

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    headers,
    method: 'POST',
    body: JSON.stringify(body),
  });

  console.log({ data: await res.json(), status: res.status });

  if (res.status !== 201) {
    return { success: false };
  }

  return { success: true };
}

export async function registerAuthor(
  data: (typeof authors)['$inferInsert'],
  { ...emailData }: { to: string; subject: string; html: string; username: string }
) {
  await db.transaction(async (tx) => {
    const author = await tx.insert(authors).values(data);

    if (!author || author.rowsAffected === 0) {
      await tx.rollback();

      return { success: false };
    }

    const email = await sendEmail(emailData);

    if (!email.success) {
      await tx.rollback();

      return { success: false };
    }
  });

  return { success: true };
}
