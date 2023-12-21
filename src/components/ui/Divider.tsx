import {
  Divider as NextUIDivider,
  type DividerProps as NextUIDividerProps,
} from '@nextui-org/divider';

import { cn } from '@/utils/utils';

type DividerProps = {
  className?: string;
} & NextUIDividerProps;

const Divider = ({ className, ...props }: DividerProps) => {
  return (
    <NextUIDivider
      aria-disabled
      {...props}
      className={cn('h-[1.5px] w-full bg-primary-500', className)}
    />
  );
};

export default Divider;
