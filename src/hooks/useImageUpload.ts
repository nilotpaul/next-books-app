import { getImageUrl } from '@/utils/getImageUrl';
import type { RegisterAuthor } from '@/validations/authorValidations';
import {
  signedUrlUploadValidator,
  uploadImageValidation,
} from '@/validations/uploadImageValidation';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import type { UseFormSetValue } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export function useSignedUrlToUpload(
  setUrl?: UseFormSetValue<RegisterAuthor>,
  onClose?: () => void
) {
  const router = useRouter();

  const {
    mutate: uploadImage,
    isLoading,
    isError,
    isSuccess,
    data,
  } = useMutation({
    mutationFn: async (file: File) => {
      const { file: imageFile } = uploadImageValidation.parse({ file }) as { file: File };

      const { data } = await axios.post('/api/upload/image/presign', {
        type: imageFile.type,
      });

      const { postUrl, key, fields } = signedUrlUploadValidator.parse(data);

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

      return { key };
    },
    onSuccess: (data) => {
      toast.success('Image uploaded successfully');
      router.refresh();

      if (setUrl) {
        setUrl('imageUrl', getImageUrl(data.key));
      }
      if (onClose) {
        onClose();
      }
    },
    onError: (err) => {
      console.error('[AWS_S3: client]', err);

      if (err instanceof AxiosError) {
        toast.error(err.response?.data);
        return;
      }
      if (err instanceof z.ZodError) {
        toast.error('Invalid image type');
        return;
      }

      toast.error('Failed to upload image');
    },
  });

  return {
    uploadImage,
    data,
    isLoading,
    isError,
    isSuccess,
  };
}

export function useUploadImage() {
  const uploadImage = async (file: File, onSuccess?: (publicUrl: string, key: string) => void) => {
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
        onSuccess(publicUrl, key);
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
