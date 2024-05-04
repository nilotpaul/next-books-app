import { WebhookEvent } from '@clerk/nextjs/server';
import { Webhook } from 'svix';
import { users } from '@/lib/db/schema';
import { env } from '@/validations/env';
import { createUser, deleteUser, updateUser } from '@/services/user.services';

export async function POST(req: Request) {
  const svix_id = req.headers.get('svix-id');
  const svix_timestamp = req.headers.get('svix-timestamp');
  const svix_signature = req.headers.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('No svix headers found', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(env.WEBHOOK_SECRET);

  let event: WebhookEvent;

  try {
    event = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;

    if (event.type === 'user.created') {
      const createUserPayload: (typeof users)['$inferInsert'] = {
        clerkId: payload.data.id,
        email: payload.data.email_addresses[0].email_address,
        firstName: payload.data.first_name,
        lastName: payload.data.last_name,
        username: payload.data.username,
        imageUrl: payload.data.profile_image_url,
        strategy: payload.data.email_addresses[0].verification.strategy,
        updatedAt: new Date(),
      };
      await createUser(createUserPayload);
    } else if (event.type === 'user.deleted') {
      await deleteUser(payload.data.id);
    } else if (event.type === 'user.updated') {
      await updateUser(payload.data.id, {
        imageUrl: payload.data.image_url,
        username: payload.data.username,
      });
    }
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400,
    });
  }

  return new Response(null, { status: 200 });
}
