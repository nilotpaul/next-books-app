import { Kbd } from '@nextui-org/react';

type layoutProps = {
  children: React.ReactNode;
};

const layout = ({ children }: layoutProps) => {
  return <div className='p-4'>{children}</div>;
};

export default layout;
