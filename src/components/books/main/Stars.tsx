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
  displayOnly?: boolean;
};

const Stars = ({ stars, length = 5, bookId, displayOnly = false }: StarsProps) => {
  const router = useRouter();
  const utils = trpc.useUtils();
  let totalStars: number = stars;

  console.log(totalStars);

  const { mutate: rateBook } = trpc.bookRouter.rateBook.useMutation({
    onMutate: ({ stars }) => {
      const prevStars = totalStars;
    },
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
            onClick={() => !displayOnly && rateBook({ bookId, stars: index + 1 })}
            className={cn('h-4 w-4 text-warning', {
              'fill-warning': totalStars > index,
              'cursor-pointer': !displayOnly,
            })}
          />
        ))}
    </>
  );
};

export default Stars;
