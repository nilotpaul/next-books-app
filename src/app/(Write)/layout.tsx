type layoutProps = {
  children: React.ReactNode;
};

const layout = ({ children }: layoutProps) => {
  return <div className='h-screen space-y-16 p-4'>{children}</div>;
};

export default layout;
