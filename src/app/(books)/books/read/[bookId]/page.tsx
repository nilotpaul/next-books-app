import { getPublishedBookWithAuthorById } from '@/services/books.services';
import { notFound } from 'next/navigation';

import Container from '@/components/ui/Container';
import Reader from '@/components/books/read/Reader';
import { getcontentByChapter } from '@/lib/blocksParser';

type pageProps = {
  params: {
    bookId: string;
  };
};

const page = async ({ params }: pageProps) => {
  const { bookId } = params;
  const dbBook = await getPublishedBookWithAuthorById(bookId); // later only published books will show up

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

  const chapters = getcontentByChapter(book.content);

  if (!chapters || chapters?.length === 0) {
    return notFound();
  }
  const index = 0;

  return (
    <Container className='h-[calc(100vh-1.5rem)] px-0 sm:max-w-3xl'>
      <Reader content={chapters?.[index].content} />
    </Container>
  );
};

export default page;
