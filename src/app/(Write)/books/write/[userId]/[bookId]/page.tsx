import { getAuthorBookById } from '@/services/books.services';
import { notFound } from 'next/navigation';
import { omit } from 'lodash';

import Topbar from '@/components/books/write/Topbar';
import Editor from '@/components/editor/Editor';

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

  if (!bookId || !userId || !book) {
    return notFound();
  }

  return (
    <>
      <Topbar book={book} />

      <div className='mt-8'>
        <Editor
          defaultValues={{
            title: book.bookTitle,
          }}
          label={{ titleBar: 'Book Title', editor: 'Book Content' }}
          placeholder={{
            titleBar: 'Enter book title here',
            editor: 'Start Writing...',
          }}
        />
      </div>
    </>
  );
};

export default WriteBookPage;
