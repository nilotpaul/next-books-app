import { type UseFormSetValue } from 'react-hook-form';
import { MAX_FILE_SIZE } from '@/config/constants/imageUpload';
import { useSignedUrlToUpload } from '@/hooks/useImageUpload';
import { type RegisterAuthor } from '@/validations/authorValidations';
import { useDropzone } from 'react-dropzone';

import Image from '../ui/Image';
import { UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@nextui-org/skeleton';

type ProfileImageDropzone = {
  setValue: UseFormSetValue<RegisterAuthor>;
  onClose?: () => void;
};

const ProfileImageDropzone = ({ setValue, onClose }: ProfileImageDropzone) => {
  const { uploadImage, isLoading, getUrl: image } = useSignedUrlToUpload(setValue, onClose);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    onDrop: async (acceptedFiles) => {
      try {
        if (!acceptedFiles || acceptedFiles.length === 0) {
          throw new Error('File not found');
        }

        uploadImage(acceptedFiles[0]);
      } catch (err) {
        console.error(err);

        if (err instanceof Error) {
          toast.error(err.message);
          return;
        }
      }
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });

  return (
    <div {...getRootProps({ className: 'relative w-28 h-28 rounded-full' })}>
      <input {...getInputProps()} />
      {image && (
        <Image
          isLoading={isLoading}
          src={image}
          fallbackSrc=''
          alt='Profile Image'
          radius='full'
          className='h-28 w-28 cursor-pointer'
          height={112}
          width={112}
        />
      )}
      {isLoading && (
        <span
          aria-disabled
          className='absolute left-0 top-0 z-10 h-28 w-28 animate-spin rounded-full border-t-2 border-t-primary'
        />
      )}
      {!isLoading && (
        <Skeleton
          aria-label='Uploading'
          className='absolute top-0 h-28 w-28 cursor-pointer rounded-full before:animate-none after:animate-none'
        />
      )}

      <span className='absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center text-sm font-medium text-default-800'>
        <UploadCloud className='text-danger' />
        {!isLoading ? 'Drop Image' : 'Uploading...'}
      </span>
    </div>
  );
};

export default ProfileImageDropzone;
