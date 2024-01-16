import { getAuthorWithBooksById } from '@/services/author.services';
import { DashboardContext } from '../context/DashboardContext';
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
  }>;
};

const TabsWrapper = async ({ getData }: TabsWrapperProps) => {
  const { isAuthor, user } = await getData();

  if (isAuthor) {
    const { books, author } = await getAuthorWithBooksById(user.userId);
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
          forumPosts: [],
          purchases: [],
          reviews: [],
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
        forumPosts: [],
        purchases: [],
        reviews: [],
      }}
    >
      <ManageDashTabs />
    </DashboardContext>
  );
};

export default TabsWrapper;
