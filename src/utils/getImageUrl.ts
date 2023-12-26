import { env } from '@/validations/env';

export function getImageUrl(key: string) {
  if (!key || key === '') {
    return '';
  }
  const url = `https://${env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;

  return url;
}
