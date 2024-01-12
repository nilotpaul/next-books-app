import { stripe } from '@/lib/payments/stripeServer';
import { getBookById } from '@/services/books.services';
import { getUserById, purchaseBook } from '@/services/user.services';
import { env } from '@/validations/env';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await req.headers.get('Stripe-Signature')) ?? '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(err);

    if (err instanceof Error) {
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    } else {
      return new Response('Unknown Error', { status: 400 });
    }
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (!session?.metadata?.userId) {
    return new Response(null, { status: 200 });
  }

  const amt_paid = session.amount_total;
  const userId = session.metadata.userId;
  const bookId = session.metadata.bookId;

  if (!amt_paid || !bookId || !userId) {
    console.error('Invalid details');
    return new Response(null, { status: 200 });
  }

  const [book, user] = await Promise.all([getBookById(bookId), getUserById(userId)]);

  if (!user?.clerkId || !book?.id) {
    console.error('Book / user not found');
    return new Response(null, { status: 200 });
  }

  console.log({ event: event.type });

  if (event.type === 'checkout.session.completed') {
    const { success } = await purchaseBook(book.id, userId, user.purchasedBooks || []);

    if (!success) {
      console.error('Db error');
      return new Response(null, { status: 200 });
    }

    console.log('POST: STRIPE CHECKOUT SESSION (HIT)');
  }

  return new Response(null, { status: 200 });
}
