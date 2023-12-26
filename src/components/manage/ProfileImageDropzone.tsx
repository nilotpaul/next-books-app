import { useState } from 'react';
import { type UseFormSetValue } from 'react-hook-form';
import { MAX_FILE_SIZE } from '@/config/constants/imageUpload';
import { useUploadImage } from '@/hooks/useImageUpload';
import { type RegisterAuthor } from '@/validations/authorValidations';
import { useDropzone } from 'react-dropzone';

import Image from '../ui/Image';
import { UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@nextui-org/skeleton';
import { cn } from '@/utils/utils';

type ProfileImageDropzone = {
  setValue: UseFormSetValue<RegisterAuthor>;
  classNames?: {
    wrapper?: string;
    image?: string;
    skeleton?: string;
    spinner?: string;
    icon?: string;
  };
};

const ProfileImageDropzone = ({ setValue, classNames }: ProfileImageDropzone) => {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState('');

  const { uploadImage } = useUploadImage();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    onDrop: async (acceptedFiles) => {
      try {
        setIsLoading(true);
        if (!acceptedFiles || acceptedFiles.length === 0) {
          setIsLoading(false);
          throw new Error('File not found');
        }

        const data = await uploadImage(acceptedFiles[0], (imageUrl) => {
          setValue('imageUrl', imageUrl);
        });
        setImage(data?.publicUrl ?? '');
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.error(err);

        if (err instanceof Error) {
          toast.error(err.message);
          return;
        }

        toast.error('Failed to upload image');
      }
    },
    onError: (err) => {
      setIsLoading(false);
      console.error(err);
      toast.error(err.message);
    },
  });

  return (
    <div
      {...getRootProps({
        className: cn(
          'relative cursor-pointer w-28 h-28 bg-default-100 rounded-full',
          classNames?.wrapper
        ),
      })}
    >
      <input {...getInputProps()} />
      {image && (
        <Image
          isLoading={isLoading}
          src={image}
          alt='Profile Image'
          radius='full'
          className={cn('h-28 w-28 cursor-pointer', classNames?.image)}
          height={112}
          width={112}
          priority
          loading='eager'
        />
      )}
      {isLoading && (
        <>
          <Skeleton
            className={cn('absolute h-28 w-28 cursor-pointer rounded-full', classNames?.skeleton)}
          />
          <span
            aria-disabled
            className='absolute left-0 top-0 z-10 h-28 w-28 animate-spin rounded-full border-t-2 border-t-primary'
          />
        </>
      )}

      <span
        className={cn(
          'absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center text-center text-sm font-medium text-default-800',
          classNames?.spinner
        )}
      >
        <UploadCloud className={cn('text-danger', classNames?.icon)} />
        {!isLoading ? 'Drop Image' : 'Uploading...'}
      </span>
    </div>
  );
};

export default ProfileImageDropzone;
