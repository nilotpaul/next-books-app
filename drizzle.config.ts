import { type Config } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config({
  path: './.env.local',
});

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('ERROR drizzle.config.ts: DATABASE_URL is undefined');
}

export default {
  schema: './src/lib/db/schema.ts',
  out: './migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: DATABASE_URL,
  },
  breakpoints: true,
} satisfies Config;
