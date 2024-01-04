type ReadBookProps = {
  children: React.ReactNode;
};

const ReadBook = ({ children }: ReadBookProps) => {
  return <div className='h-screen p-3 py-0 md:p-4'>{children}</div>;
};

export default ReadBook;
