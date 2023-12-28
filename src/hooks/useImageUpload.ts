import {
  signedUrlUploadValidator,
  uploadImageValidation,
} from '@/validations/uploadImageValidation';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { z } from 'zod';

export function useUploadImage() {
  const uploadImage = async (
    file: File,
    onSuccess?: (publicUrl: string, key: string) => Promise<void> | void
  ) => {
    try {
      const { file: imageFile } = uploadImageValidation.parse({ file }) as { file: File };

      const { data } = await axios.post('/api/upload/image/presign', {
        type: imageFile.type,
      });

      const { postUrl, publicUrl, key, fields } = signedUrlUploadValidator.parse(data);

      const uploadImage = {
        ...fields,
        'Content-Type': file.type,
        file,
      };

      const formData = new FormData();
      Object.entries(uploadImage).forEach(([key, value]) => {
        formData.append(key, value);
      });

      console.log('uploading...');

      await axios.post(postUrl, formData);

      if (onSuccess) {
        await onSuccess(publicUrl, key);
      }

      return { publicUrl, key };
    } catch (err) {
      console.error('[AWS_S3: client]', err);
      if (err instanceof z.ZodError) {
        toast.error(err.issues[0].message);
        return;
      }
      if (err instanceof AxiosError) {
        toast.error(err.response?.data);
        return;
      }

      toast.error('Failed to upload image');
    }
  };

  const uploadImageDirect = async (file: File, onSuccess?: () => void) => {
    if (!file) {
      throw new Error('No file found');
    }

    try {
      const { file: imageFile } = uploadImageValidation.parse({ file }) as { file: File };

      const formData = new FormData();
      formData.set('file', imageFile);

      const { data } = await axios.post<{ progress: number; error: boolean }>(
        '/api/upload/image',
        formData
      );

      console.log('uploading...');

      if (onSuccess) {
        onSuccess();
      }

      return data;
    } catch (err) {
      console.error('[AWS_S3: client]', err);
      if (err instanceof z.ZodError) {
        toast.error(err.issues[0].message);
        return;
      }
      if (err instanceof AxiosError) {
        toast.error(err.response?.data);
        return;
      }
      if (err instanceof Error) {
        toast.error(err.message);
        return;
      }

      toast.error('Failed to upload image');
    }
  };

  return { uploadImage, uploadImageDirect };
}
