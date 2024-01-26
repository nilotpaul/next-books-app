import axios from 'axios';

export const runtime = 'edge';
export const preferredRegion = ['sin1', 'cle1', 'fra1'];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const link = searchParams.get('url');

  if (!link) {
    return new Response('Invalid Link', { status: 400 });
  }

  const { data, status } = await axios.get(link);

  if (status !== 200 || !data) {
    return new Response('Failed to fetch from the link', { status: 500 });
  }

  const titleMatch = data.match(/<title>(.*?)<\/title>/);
  const title = titleMatch ? titleMatch[1] : '';

  const descriptionMatch = data.match(/<meta name="description" content="(.*?)"/);
  const description = descriptionMatch ? descriptionMatch[1] : '';

  const imageMatch = data.match(/<meta property="og:image" content="(.*?)"/);
  const imageUrl = imageMatch ? imageMatch[1] : '';

  return new Response(
    JSON.stringify({
      success: 1,
      meta: {
        title,
        description,
        image: {
          url: imageUrl,
        },
      },
    })
  );
}
