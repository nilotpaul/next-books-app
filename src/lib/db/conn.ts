import { env } from '@/validations/env';
import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';
import * as schema from './schema';

const conn = connect({
  host: env.DATABASE_HOST,
  username: env.DATABASE_USERNAME,
  password: env.DATABASE_PASSWORD,
});

export const db = drizzle(conn, { schema, logger: process.env.NODE_ENV === 'development' });
