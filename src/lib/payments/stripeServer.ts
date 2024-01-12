import { env } from '@/validations/env';
import Stripe from 'stripe';

export const stripe = new Stripe(env.STRIPE_SERECT_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
});
