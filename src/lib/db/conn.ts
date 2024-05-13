import { env } from '@/validations/env';

import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

import * as schema from './schema';

const poolConn = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle(poolConn, { schema });
