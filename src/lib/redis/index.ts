import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { env } from '@/validations/env';

type Command = 'get' | 'set' | 'zadd';
type Duration = Parameters<typeof Ratelimit.slidingWindow>['1'];

export async function fetchRedis(command: Command, ...values: (string | number)[]) {
  const url = `${env.UPSTASH_REDIS_REST_URL}/${command}/${values.join('/')}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Redis Error: ${res.statusText}`);
  }

  const data = await res.json();

  return data.result;
}

export const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

export function rateLimit(tokens: number, duration: Duration) {
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(tokens, duration),
  });
}
