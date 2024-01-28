import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  UpdateAuthorProfile,
  updateAuthorProfileValidation,
} from '@/validations/authorValidations';
import { trpc } from '@/lib/trpc/TRPCProvider';
import { useRouter } from 'next/navigation';
import { BookGenres } from '@/types/author.types';
import { toast } from 'sonner';

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/modal';
import { Button, ButtonProps } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import CircleImageDropzone from '../dropzones/CircleImageDropzone';

type InitialDataProps = {
  authorName: string;
  authorImage: string;
  bio: string;
  genres: BookGenres;
  links: {
    instagram?: string;
    twitter?: string;
  };
};

type AuthorProfileUpdateModalProps = {
  children: React.ReactNode;
  type: 'Author Profile' | 'Social Links';
} & Partial<Pick<ButtonProps, 'variant' | 'color'>> &
  Partial<InitialDataProps>;

const AuthorProfileUpdateModal = ({
  color = 'primary',
  variant = 'bordered',
  authorImage,
  authorName,
  bio,
  genres,
  links,
  type,
  children,
}: AuthorProfileUpdateModalProps) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UpdateAuthorProfile>({
    resolver: zodResolver(updateAuthorProfileValidation),
    mode: 'onChange',
    defaultValues: {
      authorName: authorName || undefined,
      authorImage: authorImage || undefined,
      bio: bio || undefined,
      genres: genres || undefined,
      links: {
        instagram: links?.instagram || undefined,
        Twitter: links?.twitter || undefined,
      },
    },
  });

  const { mutate: updateProfile, isLoading } = trpc.authorRouter.updateProfile.useMutation({
    onSuccess: () => {
      router.refresh();
      toast.success('Profile Updated');
      onClose();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <>
      <Button onClick={onOpen} size='sm' variant={variant} color={color}>
        {children}
      </Button>

      <Modal isOpen={isOpen} backdrop='blur' onOpenChange={onOpenChange}>
        <ModalContent>
          <form onSubmit={handleSubmit((values) => updateProfile(values))}>
            <ModalHeader>Update {type}</ModalHeader>

            <ModalBody className='flex items-center'>
              {type === 'Author Profile' && (
                <>
                  <CircleImageDropzone
                    initialImage={authorImage}
                    onUpload={(imageUrl) => {
                      setValue('authorImage', imageUrl);
                      imageUrl ?? toast.success('Uploaded image successfully');
                    }}
                  />
                  <Input
                    {...register('authorName')}
                    defaultValue={authorName}
                    label='Enter Author Name'
                    placeholder='Enter your new author name'
                    errorMessage={errors.authorName?.message}
                  />
                </>
              )}

              {type === 'Social Links' && (
                <>
                  <Input
                    {...register('bio')}
                    defaultValue={bio}
                    label='Enter Bio'
                    placeholder='Enter author bio'
                    errorMessage={errors.bio?.message}
                  />
                  <Input
                    onChange={(e) => {
                      if (e.target.value.length) {
                        setValue('links.Twitter', e.target.value);
                      }
                    }}
                    defaultValue={links?.twitter}
                    label='Enter Twitter Profile'
                    placeholder='Enter twitter profile link'
                    errorMessage={errors.links?.Twitter?.message}
                  />
                  <Input
                    onChange={(e) => {
                      if (e.target.value.length) {
                        setValue('links.instagram', e.target.value);
                      }
                    }}
                    defaultValue={links?.instagram}
                    label='Enter Instagram Profile'
                    placeholder='Enter Instagram profile link'
                    errorMessage={errors.links?.instagram?.message}
                  />
                </>
              )}
            </ModalBody>

            <ModalFooter>
              <Button className='font-medium' isLoading={isLoading} type='submit' color='success'>
                Submit
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AuthorProfileUpdateModal;
