import { MAX_FILE_SIZE } from '@/config/constants/imageUpload';
import { s3 } from '@/lib/aws/s3Bucket';
import { userSession } from '@/services/auth.services';
import { env } from '@/validations/env';
import { imagePresignValidation } from '@/validations/uploadImageValidation';
import { nanoid } from 'nanoid';
import { z } from 'zod';

export async function POST(req: Request) {
  const user = await userSession();

  if (!user || !user.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = await req.json();

  try {
    const { type } = imagePresignValidation.parse(body);

    const uniqueId = nanoid();
    const extension = type.split('/')[1];
    const key =
      'author_profile' + `/${user.id}|${uniqueId.replace('-', '').replace('|', '')}|${extension}`;

    const { url: postUrl, fields } = (await new Promise((resolve, reject) => {
      s3.createPresignedPost(
        {
          Bucket: env.AWS_BUCKET_NAME,
          Fields: { key },
          Expires: 60,
          Conditions: [
            ['content-length-range', 0, MAX_FILE_SIZE],
            ['starts-with', '$Content-Type', 'image/'],
          ],
        },
        (err, data) => {
          if (err) {
            console.error('[AWS_S3_ERROR]:', err);
            reject(err);
          }
          resolve(data);
        }
      );
    })) as { url: string; fields: any };

    if (!postUrl || !fields) {
      return new Response('Failed to create signed url', { status: 500 });
    }

    const getUrl = await s3.getSignedUrlPromise('getObject', {
      Bucket: env.AWS_BUCKET_NAME,
      Key: key,
    });

    if (!getUrl) {
      return new Response('Failed to create signed url', { status: 500 });
    }

    return new Response(JSON.stringify({ postUrl, getUrl, fields }));
  } catch (err) {
    console.error(err);

    if (err instanceof z.ZodError) {
      return new Response(err.message, { status: 422 });
    }
    if (err instanceof Error) {
      return new Response(err.message, { status: 500 });
    }

    return new Response('Something went wrong', { status: 500 });
  }
}
