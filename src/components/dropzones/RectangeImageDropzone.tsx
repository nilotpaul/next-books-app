import { useState } from 'react';
import { MAX_FILE_SIZE } from '@/config/constants/imageUpload';
import { useUploadImage } from '@/hooks/useImageUpload';
import { useDropzone } from 'react-dropzone';

import { Image } from '@nextui-org/image';
import { UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@nextui-org/skeleton';
import { cn } from '@/utils/utils';

type RectangleImageDropzoneProps = {
  classNames?: {
    icon?: string;
  };
  label?: string;
  onUpload?: (publicUrl: string, key: string) => Promise<void> | void;
};

const RectangeImageDropzone = ({ label, classNames, onUpload }: RectangleImageDropzoneProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
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
      const preview = URL.createObjectURL(acceptedFiles[0]);
      setPreviewImage(preview);

      try {
        setIsLoading(true);
        if (!acceptedFiles || acceptedFiles.length === 0) {
          throw new Error('File not found');
        }

        const data = await uploadImage(acceptedFiles[0], onUpload);

        setImage(data?.publicUrl ?? '');
      } catch (err) {
        console.error(err);

        if (err instanceof Error) {
          toast.error(err.message);
          return;
        }

        toast.error('Failed to upload image');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });

  return (
    <>
      <div
        {...getRootProps({
          className: cn(
            'h-[10rem] relative flex-col cursor-pointer gap-y-1.5 flex px-3 py-1.5 w-full bg-foreground-100 rounded-xl',
            {
              'py-0 px-0': image,
            }
          ),
        })}
      >
        {!image ? (
          <>
            {label && (
              <label htmlFor='dropzone' className='cursor-pointer text-sm text-foreground-700'>
                {label}
              </label>
            )}
            <input {...getInputProps()} id='dropzone' />

            <span
              className={cn(
                'absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary',
                {
                  'after:absolute after:h-20 after:w-20 after:animate-spin after:rounded-full after:border-t-2 after:border-t-danger after:content-[""]':
                    isLoading,
                }
              )}
            >
              {!previewImage ? (
                <UploadCloud className={cn('h-10 w-10', classNames?.icon)} />
              ) : (
                <Image
                  src={previewImage || ''}
                  alt='Preview Image'
                  width={64}
                  height={64}
                  classNames={{
                    wrapper: 'rounded-full',
                    img: 'rounded-full h-[64px] w-[64px]',
                  }}
                />
              )}
            </span>
          </>
        ) : (
          <div className='flex w-full items-center justify-center rounded-xl bg-black/60'>
            <Image radius='sm' src={image} alt='Uploaded Image' className='h-[10rem] min-w-full' />
          </div>
        )}
      </div>
    </>
  );
};

export default RectangeImageDropzone;
