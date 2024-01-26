import { getAuthorWithBooksById } from '@/services/author.services';
import { DashboardContext } from '../context/DashboardContext';
import { ForumPost } from '@/types/forumPost.types';
import { MAX_SEARCH_RESULTS_LIMIT } from '@/config/constants/search-filters';
import { PurchasedBook } from '@/types/book.types';
import { omit } from 'lodash';

import ManageDashTabs from './ManageDashTabs';

type TabsWrapperProps = {
  getData: () => Promise<{
    user: {
      userId: string;
      userImage: string;
      name: string;
    };
    isAuthor: boolean;
    forumPosts: ForumPost[];
    purchasedBooks: PurchasedBook[];
  }>;
};

const TabsWrapper = async ({ getData }: TabsWrapperProps) => {
  const { isAuthor, user, forumPosts, purchasedBooks } = await getData();

  if (isAuthor) {
    const { books, author } = await getAuthorWithBooksById(
      user.userId,
      MAX_SEARCH_RESULTS_LIMIT + 1
    );
    const newbooks = books.map((book) => {
      return {
        authorImage: author.author_image,
        authorName: author.authorName,
        ...omit(book, ['normalised_title']),
      };
    });

    return (
      <DashboardContext
        values={{
          user,
          isAuthor,
          authorBooks: newbooks,
          forumPosts,
          purchases: purchasedBooks,
        }}
      >
        <ManageDashTabs />
      </DashboardContext>
    );
  }

  return (
    <DashboardContext
      values={{
        user,
        isAuthor,
        forumPosts,
        purchases: purchasedBooks,
      }}
    >
      <ManageDashTabs />
    </DashboardContext>
  );
};

export default TabsWrapper;
