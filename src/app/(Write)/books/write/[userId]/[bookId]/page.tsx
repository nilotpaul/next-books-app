import Topbar from '@/components/books/write/Topbar';
import Editor from '@/components/editor/Editor';

type WriteBookPageProps = {
  params: {
    userId: string;
    bookId: string;
  };
};

const WriteBookPage = ({ params }: WriteBookPageProps) => {
  return (
    <>
      <Topbar />

      <div>
        <Editor
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
