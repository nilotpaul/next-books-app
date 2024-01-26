import aws from 'aws-sdk';
import { env } from '@/validations/env';

export const s3 = new aws.S3({
  credentials: {
    accessKeyId: env.AWS_BUCKET_ACCESS_KEY,
    secretAccessKey: env.AWS_BUCKET_SECRET_KEY,
  },
  region: 'ap-southeast-1',
});
