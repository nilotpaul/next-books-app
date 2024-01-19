import { cn } from '@/utils/utils';

const EmptyArrayFallback = ({ className, message }: { className?: string; message?: string }) => {
  return (
    <p className={cn('absolute left-1/2 -translate-x-1/2 text-foreground-600', className)}>
      {message ? message : 'No items found!'}
    </p>
  );
};

export default EmptyArrayFallback;
