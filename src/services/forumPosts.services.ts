import { db } from '@/lib/db/conn';
import { forumPosts, users } from '@/lib/db/schema';
import { ForumPost } from '@/validations/forumPostValidations';
import { and, eq } from 'drizzle-orm';
import { cache } from 'react';

import 'server-only';

export const getForumPosts = cache(async (limit?: number) => {
  const row = await db
    .select({
      clerkId: forumPosts.clerkId,
      id: forumPosts.id,
      image: forumPosts.image,
      postTitle: forumPosts.postTitle,
      content: forumPosts.content,
      createdAt: forumPosts.createdAt,
      tags: forumPosts.tags,
      firstName: users.firstName,
      lastName: users.lastName,
    })
    .from(forumPosts)
    .leftJoin(users, eq(users.clerkId, forumPosts.clerkId))
    .limit(limit ?? 10);

  if (row.length === 0 || !row[0].id) {
    return null;
  }

  return row;
});

export const getUserForumPosts = cache(async (userId: string, limit?: number) => {
  const row = await db
    .select({
      userId: forumPosts.clerkId,
      postId: forumPosts.id,
      postTitle: forumPosts.postTitle,
      postImage: forumPosts.image,
      createdAt: forumPosts.createdAt,
    })
    .from(forumPosts)
    .where(eq(forumPosts.clerkId, userId))
    .limit(limit ?? 10);

  if (row.length === 0 || !row[0]?.postId) {
    return null;
  }

  return row;
});

export const getForumPostById = cache(async (postId: string) => {
  const row = await db.select().from(forumPosts).where(eq(forumPosts.id, postId));

  if (row.length === 0 || !row[0]?.id) return null;

  return row[0];
});

export const getUserForumPostByTitle = cache(async (postTitle: string, userId: string) => {
  const row = await db
    .select()
    .from(forumPosts)
    .where(and(eq(forumPosts.postTitle, postTitle), eq(forumPosts.clerkId, userId)));

  if (row.length === 0 || !row[0]?.id) return null;

  return row[0];
});

export const createForumPost = async (values: ForumPost & { userId: string }) => {
  const createdPost = await db.insert(forumPosts).values({
    id: values.id,
    clerkId: values.userId,
    postTitle: values.postTitle,
    content: values.content,
    image: values.image,
    isAuthor: values.isAuthor,
    tags: values.tags,
  });

  if (createdPost.rowsAffected === 0) {
    return { success: false };
  }

  return { success: true };
};
