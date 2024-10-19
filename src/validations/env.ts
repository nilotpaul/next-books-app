import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url().min(1),
  UPSTASH_REDIS_REST_URL: z.string().url().min(1),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(1),
  WEBHOOK_SECRET: z.string().min(1),
  BREVO_SMTP_KEY: z.string().min(1),
  BREVO_API_KEY: z.string().min(1),
  ADMIN_EMAIL: z.string().email().min(1),
  AWS_BUCKET_ACCESS_KEY: z.string().min(1),
  AWS_BUCKET_SECRET_KEY: z.string().min(1),
  AWS_BUCKET_NAME: z.string().min(1),
  STRIPE_SERECT_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  NEXT_URL: z.string().url().min(1),
});

export const env = envSchema.parse(process.env);
