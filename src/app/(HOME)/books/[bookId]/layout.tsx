type layoutProps = {
  children: React.ReactNode;
};

const layout = ({ children }: layoutProps) => {
  return (
    <>
      <div className='mt-6'>{children}</div>
    </>
  );
};

export default layout;
