type layoutProps = {
  children: React.ReactNode;
};

const layout = ({ children }: layoutProps) => {
  return <div className='h-screen p-3 py-0 md:p-4'>{children}</div>;
};

export default layout;
