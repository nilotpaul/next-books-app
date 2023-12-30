'use client';

import { Book } from '@/types/book.types';
import Editor from '@/components/editor/Editor';
import Topbar from './Topbar';
import { useEditor } from '@/hooks/useEditor';

type MainWrapperProps = {
  book: Omit<Book, 'normalised_title' | 'stars' | 'updatedAt' | 'publicationDate'>;
};

const MainWrapper = ({ book }: MainWrapperProps) => {
  const { requestSubmit, ...rest } = useEditor();

  return (
    <>
      <Topbar book={book} requestSubmit={requestSubmit} />

      <div className='mt-8'>
        <Editor
          {...rest}
          data={book.content}
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

export default MainWrapper;
