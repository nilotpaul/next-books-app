import { cn } from '@/utils/utils';
import Divider from './ui/Divider';

type HeadingProps = {
  children: React.ReactNode;
  classNames?: {
    heading?: string;
    divider?: string;
  };
};

const Heading = ({ children, classNames }: HeadingProps) => {
  return (
    <h2 className={cn('w-fit text-base font-semibold xs:text-xl md:text-2xl', classNames?.heading)}>
      {children}

      <Divider className={cn('mt-1 h-[1.5px] w-[calc(100%+1.75rem)]', classNames?.divider)} />
    </h2>
  );
};

export default Heading;
