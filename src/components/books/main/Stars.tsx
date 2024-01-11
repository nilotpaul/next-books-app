import { cn } from '@/utils/utils';
import { Star } from 'lucide-react';

type StarsProps = {
  stars: number;
  length?: number;
};

const Stars = ({ stars, length = 5 }: StarsProps) => {
  return (
    <>
      {Array(length)
        .fill(0)
        .map((_, index) => (
          <Star
            key={index}
            className={cn('h-4 w-4 cursor-pointer text-warning', {
              'fill-warning': stars > index,
            })}
          />
        ))}
    </>
  );
};

export default Stars;
