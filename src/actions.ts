'use server';

import { fetchRedis, redis } from './lib/redis';

export async function redisTesting() {
  const data = await redis.set('name', 'paul');

  return data;
}
