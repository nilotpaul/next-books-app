import { getPublishedBookWithAuthorById } from '@/services/books.services';
import { getcontentByChapter } from '@/lib/blocksParser';
import { Metadata } from 'next';
import { constructMetadata } from '@/lib/constructMetadata';
import { notFound, redirect } from 'next/navigation';

import ReaderWrapper from '@/components/books/read/ReaderWrapper';
import { purchaseStatus } from '@/utils/purchaseStatus';

export async function generateMetadata({ params: { bookId } }: BookPageProps): Promise<Metadata> {
  const bookDetails = await getPublishedBookWithAuthorById(bookId);

  if (!bookDetails) {
    return constructMetadata({
      title: 'Not Found',
      description: 'This page does not exist.',
    });
  }

  const { book, authorName } = bookDetails;

  return constructMetadata({
    title: `Read - ${book.bookTitle}`,
    description: `${book.bookTitle} written by ${authorName ?? 'booksgod author'}`,
    image: book.frontArtwork ?? undefined,
  });
}

type BookPageProps = {
  params: {
    bookId: string;
  };
};

const BookPage = async ({ params }: BookPageProps) => {
  const { bookId } = params;
  const [{ isPurchased, userId }, dbBook] = await Promise.all([
    purchaseStatus(bookId),
    getPublishedBookWithAuthorById(bookId),
  ]);

  if (!dbBook?.authorName || !dbBook.book.id) {
    return notFound();
  }

  if (dbBook.book.availability !== 'Free' && !isPurchased && dbBook.book.clerkId !== userId) {
    redirect(`/books/${bookId}`);
  }

  const { authorName, book } = dbBook;

  const metadata = {
    bookId: book.id,
    title: book.bookTitle,
    author: authorName,
    publisher: 'BookGod',
    cover: book.frontArtwork || '',
  };

  const content = getcontentByChapter(book.content);

  if (!content || content.chapters?.length === 0 || content.chapterList.length === 0) {
    return notFound();
  }

  return (
    <ReaderWrapper chapters={content.chapters} toc={content.chapterList} metadata={metadata} />
  );
};

export default BookPage;
