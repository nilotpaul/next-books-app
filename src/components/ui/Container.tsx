import { cn } from '@/utils/utils';

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const Container = ({ children, className, ...props }: ContainerProps) => {
  return (
    <div {...props} className={cn('mx-auto max-w-6xl px-4 md:px-6', className)}>
      {children}
    </div>
  );
};

export default Container;
