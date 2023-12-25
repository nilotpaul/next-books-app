import { db } from '@/lib/db/conn';
import { authors, users } from '@/lib/db/schema';
import { env } from '@/validations/env';
import { eq } from 'drizzle-orm';

export async function getAuthorById(userId: string) {
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
}

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
