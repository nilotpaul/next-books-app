import { getUserForumPosts } from '@/services/formPosts.services';

export type ForumPost = NonNullable<Awaited<ReturnType<typeof getUserForumPosts>>>[number];
