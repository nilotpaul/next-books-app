import { s3 } from '@/lib/aws/s3Bucket';
import { parseBlocks } from '@/lib/blocksParser';
import { epubValidation } from '@/validations/bookValidation';
import { env } from '@/validations/env';
import { nanoid } from 'nanoid';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { blocks, bookInfo } = epubValidation.parse(body);

    if (!blocks || blocks?.length === 0) {
      return new Response('No blocks data available', { status: 400 });
    }

    const { bookId, ...rest } = bookInfo;

    const buffer = (await parseBlocks(blocks, rest)).buffer;

    // const uniqueId = nanoid();
    // const key = `${bookId}-${uniqueId}`;

    // s3.putObject({
    //   Bucket: env.AWS_BUCKET_NAME,
    //   Body: buffer,
    //   Key: key,
    //   ACL: 'private',
    // }).promise();

    return new Response(
      JSON.stringify({
        buffer: buffer.toString('base64'),
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);

    return new Response('Something went wrong', { status: 500 });
  }
}
