'use client';

import { trpc } from '@/lib/trpc/TRPCProvider';
import { useRouter } from 'next/navigation';

import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/utils/utils';

type StarsProps = {
  stars: number;
  length?: number;
  bookId: string;
};

const Stars = ({ stars, length = 5, bookId }: StarsProps) => {
  const router = useRouter();

  const { mutate: rateBook } = trpc.bookRouter.rateBook.useMutation({
    onSettled: (data) => {
      if (data?.success) {
        toast.success('Rated');
      }
      router.refresh();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <>
      {Array(length)
        .fill(0)
        .map((_, index) => (
          <Star
            key={index}
            onClick={() => rateBook({ bookId, stars: index + 1 })}
            className={cn('h-4 w-4 cursor-pointer text-warning', {
              'fill-warning': stars > index,
            })}
          />
        ))}
    </>
  );
};

export default Stars;
