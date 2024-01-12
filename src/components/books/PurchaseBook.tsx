import getStripe from '@/lib/payments/loadStripe';
import { trpc } from '@/lib/trpc/TRPCProvider';

import { toast } from 'sonner';
import { Button, ButtonProps } from '@nextui-org/button';

type PurchaseBookProps = {
  children: React.ReactNode;
  bookId: string;
} & ButtonProps;

const PurchaseBook = ({ children, bookId, ...props }: PurchaseBookProps) => {
  const { mutate: purchase, isLoading } = trpc.userRouter.purchaseBook.useMutation({
    onSuccess: async ({ url, sessionId }) => {
      const stripe = await getStripe();
      await stripe?.redirectToCheckout({
        sessionId,
      });
    },
    onError: (err) => {
      console.error(err);
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
