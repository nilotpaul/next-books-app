import { env } from '@/validations/env';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

import * as schema from './schema';

const poolConn = mysql.createPool({
  host: env.DATABASE_HOST,
  user: env.DATABASE_USERNAME,
  password: env.DATABASE_PASSWORD,
  uri: env.DATABASE_URL
});

export const db = drizzle(poolConn, { schema, mode: 'default' });
