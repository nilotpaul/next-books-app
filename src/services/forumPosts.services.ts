import { db } from '@/lib/db/conn';
import { forumPosts, users } from '@/lib/db/schema';
import { ForumPostLikeAction } from '@/types/forumPost.types';
import { ForumPost } from '@/validations/forumPostValidations';
import { and, desc, eq, gt, lt } from 'drizzle-orm';
import { cache } from 'react';

import 'server-only';

export const getForumPosts = cache(async (limit?: number, cursor?: string) => {
  const row = await db
    .select({
      clerkId: forumPosts.clerkId,
      id: forumPosts.id,
      image: forumPosts.image,
      postTitle: forumPosts.postTitle,
      content: forumPosts.content,
      createdAt: forumPosts.createdAt,
      tags: forumPosts.tags,
      likes: forumPosts.likes,
      firstName: users.firstName,
      lastName: users.lastName,
    })
    .from(forumPosts)
    .leftJoin(users, eq(users.clerkId, forumPosts.clerkId))
    .where(cursor ? gt(forumPosts.id, cursor) : undefined)
    .orderBy(desc(forumPosts.image), desc(forumPosts.createdAt))
    .limit(limit ?? 10);

  if (row.length === 0 || !row[0].id) {
    return null;
  }

  return row;
});

export const getUserForumPosts = cache(async (userId: string, limit?: number, cursor?: string) => {
  const row = await db
    .select({
      userId: forumPosts.clerkId,
      postId: forumPosts.id,
      postTitle: forumPosts.postTitle,
      postImage: forumPosts.image,
      postLikes: forumPosts.likes,
      postTags: forumPosts.tags,
      createdAt: forumPosts.createdAt,
    })
    .from(forumPosts)
    .where(and(eq(forumPosts.clerkId, userId), cursor ? lt(forumPosts.id, cursor) : undefined))
    .orderBy(desc(forumPosts.id))
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

export const likeForumPost = async ({
  action,
  postId,
  userId,
  prevTotalLikes,
}: ForumPostLikeAction & {
  postId: string;
  userId: string;
  prevTotalLikes: string[];
}) => {
  if (action === 'Like') {
    console.log('Like');
    const updated = await db
      .update(forumPosts)
      .set({ likes: [...prevTotalLikes, userId] })
      .where(eq(forumPosts.id, postId));

    if (updated[0].affectedRows === 0) {
      return { success: false };
    }

    return { success: true };
  }
  console.log('Delete');
  const updated = await db
    .update(forumPosts)
    .set({ likes: prevTotalLikes.filter((item) => item !== userId) })
    .where(eq(forumPosts.id, postId));

  if (updated[0].affectedRows === 0) {
    return { success: false };
  }

  return { success: true };
};

export const deleteForumPost = async (postId: string, userId: string) => {
  const deletedPost = await db
    .delete(forumPosts)
    .where(and(eq(forumPosts.id, postId), eq(forumPosts.clerkId, userId)));

  if (deletedPost[0].affectedRows === 0) {
    return { success: false };
  }

  return { success: true };
};

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

  if (createdPost[0].affectedRows === 0) {
    return { success: false };
  }

  return { success: true };
};
