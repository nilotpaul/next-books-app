import { imageValidator } from '@/lib/aws/imageValidator';
import { s3 } from '@/lib/aws/s3Bucket';
import { userSession } from '@/services/auth.services';
import { env } from '@/validations/env';
import { uploadImageValidation } from '@/validations/uploadImageValidation';
import { nanoid } from 'nanoid';

export async function POST(req: Request) {
  const user = await userSession();

  if (!user || !user.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const formData = await req.formData();

  const imageFile = formData.get('file');

  try {
    const { file } = uploadImageValidation.parse({ file: imageFile }) as { file: File };

    const { buffer, filename } = await imageValidator(file);

    if (!buffer || !filename) {
      return new Response('Image validation failed', { status: 400 });
    }

    const uniqueId = nanoid();
    const key =
      'author_profile' + `/${user.id}|${uniqueId.replace('-', '').replace('|', '')}|${filename}`;

    let time: number = 0;
    let error: boolean = false;

    const image = await s3.putObject({
      Bucket: env.AWS_BUCKET_NAME,
      Body: buffer,
      Key: key,
      ACL: 'private',
    });

    image.on('httpUploadProgress', (progress, res) => {
      if (res.error) {
        console.error(res.error);
        return new Response('Failed to upload image', { status: 500 });
      }
      error = false;
      time = progress.loaded;
    });

    await image.promise();

    console.info('[AWS_S3]: Image uploaded');

    return new Response(JSON.stringify({ progress: time, error }), { status: 201 });
  } catch (err) {
    console.error(err);

    if (err instanceof Error) {
      return new Response('Image validation failed. Upload a valid image file', { status: 400 });
    }

    return new Response('Failed to upload image', { status: 500 });
  }
}
