'use client';

import { BooksWithoutNT } from '@/types/book.types';
import { ForumPost } from '@/types/forumPost.types';
import { createContext } from 'react';

type DashboardContextProps = {
  children: React.ReactNode;
  values: DashboadContext;
};

type DashboadContext = {
  user: {
    userId: string;
    name: string;
    userImage: string;
  };
  isAuthor: boolean;
  authorBooks?: (BooksWithoutNT[number] & {
    authorImage: string | null;
    authorName: string | null;
  })[];
  purchases: any[];
  forumPosts: ForumPost[];
  reviews: any[];
};

export const MyDashboardContext = createContext<DashboadContext>({
  user: {
    name: '',
    userId: '',
    userImage: '',
  },
  isAuthor: false,
  authorBooks: undefined,
  purchases: [],
  forumPosts: [],
  reviews: [],
});

export function DashboardContext({ children, values }: DashboardContextProps) {
  return <MyDashboardContext.Provider value={values}>{children}</MyDashboardContext.Provider>;
}
