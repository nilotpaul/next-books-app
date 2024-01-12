import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url().min(1),
    DATABASE_HOST: z.string().min(1),
    DATABASE_USERNAME: z.string().min(1),
    DATABASE_PASSWORD: z.string().min(1),
    CLERK_SECRET_KEY: z.string().min(1),
    WEBHOOK_SECRET: z.string().min(1),
    BREVO_SMTP_KEY: z.string().min(1),
    BREVO_API_KEY: z.string().min(1),
    ADMIN_EMAIL: z.string().email().min(1),
    AWS_ACCESS_KEY: z.string().min(1),
    AWS_SECRET_KEY: z.string().min(1),
    AWS_BUCKET_NAME: z.string().min(1),
    STRIPE_SERECT_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
    NEXT_URL: z.string().url().min(1),
  },

  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  },

  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_USERNAME: process.env.DATABASE_USERNAME,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
    BREVO_SMTP_KEY: process.env.BREVO_SMTP_KEY,
    BREVO_API_KEY: process.env.BREVO_API_KEY,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    STRIPE_SERECT_KEY: process.env.STRIPE_SERECT_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    NEXT_URL: process.env.NEXT_URL,
  },
});
