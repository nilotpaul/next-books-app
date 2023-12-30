'use server';

import { s3 } from './lib/aws/s3Bucket';
import { userSession } from './services/auth.services';
import { createUser } from './services/user.services';
import { EditorOutput } from './types/editor.types';
import { env } from './validations/env';

// just for testing with db

export async function manuallyCreateUser() {
  const loggedUser = (await userSession())!;

  const user = await createUser({
    clerkId: loggedUser.id,
    email: loggedUser.emailAddresses[0].emailAddress,
    firstName: loggedUser.firstName!,
    lastName: loggedUser.lastName!,
    strategy: loggedUser.emailAddresses[0].verification!.strategy,
    imageUrl: loggedUser.imageUrl,
    username: loggedUser.username,
    updatedAt: new Date(),
  });

  console.log('status:', user?.rowsAffected);
}

export async function uploadImageTest() {
  const image = await s3.putObject({
    Bucket: env.AWS_BUCKET_NAME,
    Body: 'hello',
    Key: 'hello.txt',
  });

  await image.on('httpUploadProgress', (progress, res) => console.log({ progress, res }));

  await image.promise();
}

export async function getEditorInputs(data: EditorOutput) {
  return data;
}
