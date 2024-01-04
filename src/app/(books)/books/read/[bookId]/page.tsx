import { getPublishedBookWithAuthorById } from '@/services/books.services';
import { getcontentByChapter } from '@/lib/blocksParser';
import { notFound } from 'next/navigation';

import ReaderWrapper from '@/components/books/read/ReaderWrapper';

type pageProps = {
  params: {
    bookId: string;
  };
};

const page = async ({ params }: pageProps) => {
  const { bookId } = params;
  const dbBook = await getPublishedBookWithAuthorById(bookId);

  if (!bookId || !dbBook?.authorName || !dbBook.book.id) {
    return notFound();
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

export default page;
