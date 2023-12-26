import { z } from 'zod';
import { MIME_TYPES, MIME_TYPES_READ_ONLY } from '@/config/constants/imageUpload';

export const uploadImageValidation = z.object({
  file: z.unknown().refine((image) => {
    const file = image as unknown as File;

    if (file && MIME_TYPES.includes(file.type)) {
      return file;
    }
  }),
});

export const imagePresignValidation = z.object({
  type: z.enum(MIME_TYPES_READ_ONLY, {
    errorMap: (err) => ({ message: err.message || 'Invalid image type' }),
  }),
});

export const signedUrlUploadValidator = z.object({
  postUrl: z.string(),
  publicUrl: z.string().url(),
  key: z.string(),
  fields: z.object({
    Policy: z.string(),
    'X-Amz-Algorithm': z.string(),
    'X-Amz-Credential': z.string(),
    'X-Amz-Date': z.string(),
    'X-Amz-Signature': z.string(),
    bucket: z.string(),
    key: z.string(),
  }),
});

export type UploadImage = z.infer<typeof uploadImageValidation>;
export type PresignImage = z.infer<typeof imagePresignValidation>;
export type SignedUrlUpload = z.infer<typeof signedUrlUploadValidator>;
