import { MIME_TYPES } from '@/config/constants/imageUpload';
import { validateBufferMIMEType } from 'validate-image-type';

export async function imageValidator(file: File) {
  if (!file) {
    throw new Error('No file found');
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { ok, error } = await validateBufferMIMEType(buffer, {
    allowMimeTypes: MIME_TYPES,
    originalFilename: file.name,
  });

  if (!ok) {
    console.error(error);
    return { buffer: null, filename: null, type: null };
  }

  return { buffer, filename: file.name, type: file.type };
}
