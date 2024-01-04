type WriteBookProps = {
  children: React.ReactNode;
};

const WriteBook = ({ children }: WriteBookProps) => {
  return <div className='p-4'>{children}</div>;
};

export default WriteBook;
