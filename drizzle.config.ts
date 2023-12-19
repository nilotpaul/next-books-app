import { type Config } from 'drizzle-kit';
import { env } from './src/validations/env';

export default {
  schema: './src/lib/db/schema.ts',
  out: './migrations',
  driver: 'mysql2',
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  breakpoints: true,
} satisfies Config;
