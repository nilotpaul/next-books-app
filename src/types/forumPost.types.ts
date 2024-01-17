import { getForumPosts, getUserForumPosts } from '@/services/forumPosts.services';

export type ForumPost = NonNullable<Awaited<ReturnType<typeof getUserForumPosts>>>[number];

export type FullForumPost = NonNullable<Awaited<ReturnType<typeof getForumPosts>>>[number];
