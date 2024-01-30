import { getAuthorBookById } from '@/services/books.services';
import { notFound } from 'next/navigation';
import { omit } from 'lodash';
import { constructMetadata } from '@/lib/constructMetadata';
import { Metadata } from 'next';

import MainWrapper from '@/components/books/write/MainWrapper';

export async function generateMetadata({
  params: { bookId, userId },
}: WriteBookPageProps): Promise<Metadata> {
  const book = await getAuthorBookById({ authorId: userId, bookId });

  if (!book) {
    return constructMetadata({
      title: 'Not Found',
      description: 'Page does not exist.',
    });
  }

  return constructMetadata({
    title: `Write - ${book.bookTitle}`,
    description: `Editing ${book.bookTitle}`,
    image: book.frontArtwork ?? undefined,
  });
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
