import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

import dotenv from 'dotenv';

dotenv.config({
  path: './.env.local',
});

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url().min(1),
    DATABASE_HOST: z.string().min(1),
    DATABASE_USERNAME: z.string().min(1),
    DATABASE_PASSWORD: z.string().min(1),
    CLERK_SECRET_KEY: z.string().min(1),
    WEBHOOK_SECRET: z.string().min(1),
    NEXT_URL: z.string().url().min(1),
  },

  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  },

  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_USERNAME: process.env.DATABASE_USERNAME,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
    NEXT_URL: process.env.NEXT_URL,
  },
});
