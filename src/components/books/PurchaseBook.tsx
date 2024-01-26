'use client';

import getStripe from '@/lib/payments/loadStripe';
import { trpc } from '@/lib/trpc/TRPCProvider';
import { useRouter } from 'next/navigation';

import { toast } from 'sonner';
import { Button, ButtonProps } from '@nextui-org/button';

type PurchaseBookProps = {
  children: React.ReactNode;
  bookId: string;
} & ButtonProps;

const PurchaseBook = ({ children, bookId, ...props }: PurchaseBookProps) => {
  const router = useRouter();

  const { mutate: purchase, isLoading } = trpc.userRouter.purchaseBook.useMutation({
    onSuccess: async ({ sessionId }) => {
      const stripe = await getStripe();
      await stripe!.redirectToCheckout({
        sessionId,
      });
    },
    onError: (err) => {
      console.error(err);

      if (err.data?.code === 'UNAUTHORIZED') {
        return router.push('/signin');
      }

      toast.error(err.message);
    },
  });

  return (
    <Button {...props} onClick={() => purchase(bookId)} isLoading={isLoading}>
      {children}
    </Button>
  );
};

export default PurchaseBook;
