import { getAuthorBookById } from '@/services/books.services';
import { notFound } from 'next/navigation';
import { omit } from 'lodash';

import MainWrapper from '@/components/books/write/MainWrapper';

type WriteBookPageProps = {
  params: {
    userId: string;
    bookId: string;
  };
};

const WriteBookPage = async ({ params }: WriteBookPageProps) => {
  const { bookId, userId } = params;
  const book = omit(
    await getAuthorBookById({
      authorId: userId,
      bookId,
    }),
    ['normalised_title', 'stars', 'updatedAt', 'publicationDate']
  );

  if (!bookId || !userId || !book.id) {
    return notFound();
  }

  return <MainWrapper book={book} />;
};

export default WriteBookPage;
