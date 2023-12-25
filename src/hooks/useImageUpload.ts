import type { RegisterAuthor } from '@/validations/authorValidations';
import { uploadFromSignedUrl, uploadImageValidation } from '@/validations/uploadImageValidation';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import type { UseFormSetValue } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export function useSignedUrlToUpload(
  setUrl: UseFormSetValue<RegisterAuthor>,
  onClose?: () => void
) {
  const router = useRouter();

  const {
    mutate: uploadImage,
    isLoading,
    isError,
    isSuccess,
    data: getUrl,
  } = useMutation({
    mutationFn: async (file: File) => {
      const { file: imageFile } = uploadImageValidation.parse({ file }) as { file: File };

      const { data } = await axios.post('/api/upload/image/presign', {
        type: imageFile.type,
      });

      const { getUrl, postUrl, fields } = uploadFromSignedUrl.parse(data);

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

      return getUrl;
    },
    onSuccess: (getUrl) => {
      toast.success('Image uploaded successfully');
      router.refresh();
      setUrl('imageUrl', getUrl);

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
    getUrl,
    isLoading,
    isError,
    isSuccess,
  };
}

export async function useUploadImage(file: File, onClose?: () => void) {
  const router = useRouter();

  if (!file) {
    throw new Error('No file found');
  }

  const {
    mutate: uploadImage,
    isLoading,
    isError,
    isSuccess,
  } = useMutation({
    mutationFn: async () => {
      const { file: imageFile } = uploadImageValidation.parse({ file }) as { file: File };

      const formData = new FormData();
      formData.set('file', imageFile);

      const { data } = await axios.post<{ progress: number; error: boolean }>(
        '/api/upload/image',
        formData
      );

      return data;
    },
    onSuccess: () => {
      toast.success('Image uploaded successfully');
      router.refresh();

      if (onClose) {
        onClose();
      }
    },
    onError: (err) => {
      console.error(err);

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
    isLoading,
    isError,
    isSuccess,
  };
}
