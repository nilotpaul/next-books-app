import { cn } from '@/utils/utils';

const Container = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn('mx-auto max-w-6xl px-4 md:px-6', className)}>{children}</div>;
};

export default Container;
