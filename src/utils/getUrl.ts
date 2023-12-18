import { env } from '@/validations/env';

export default function getUrl(url: string) {
  if (typeof window !== 'undefined') return url;

  if (env.NEXT_URL) {
    return `${process.env.NEXT_URL}${url}`;
  } else {
    return `http://localhost:3000${url}`;
  }
}
