import { getAuthorWithBooksById } from '@/services/author.services';
import { omit } from 'lodash';

import ManageDashTabs from './ManageDashTabs';

type TabsWrapperProps = {
  getData: () => Promise<{ userId: string; isAuthor: boolean }>;
};

const TabsWrapper = async ({ getData }: TabsWrapperProps) => {
  const { isAuthor, userId } = await getData();

  if (isAuthor) {
    const { books, author } = await getAuthorWithBooksById(userId);
    const newbooks = books.map((book) => {
      return {
        authorImage: author.author_image,
        authorName: author.authorName,
        ...omit(book, ['normalised_title']),
      };
    });

    return <ManageDashTabs userId={userId} isAuthor={isAuthor} books={newbooks} />;
  }

  return <ManageDashTabs isAuthor={isAuthor} userId={userId} books={[]} />;
};

export default TabsWrapper;
