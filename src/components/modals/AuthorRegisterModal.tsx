import { trpc } from '@/lib/trpc/TRPCProvider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerAuthorValidation, type RegisterAuthor } from '@/validations/authorValidations';
import { bookGenres } from '@/config/constants/author';
import { useRouter } from 'next/navigation';

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/modal';
import { Input } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import { Button } from '@nextui-org/button';
import { CreditCard, Mail, PencilLine, User } from 'lucide-react';
import { toast } from 'sonner';
import CircleImageDropzone from '../dropzones/CircleImageDropzone';

const AuthorRegisterModal = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<RegisterAuthor>({
    resolver: zodResolver(registerAuthorValidation),
    mode: 'onChange',
    defaultValues: {
      authorName: '',
      bio: '',
      confirm_email: '',
      imageUrl: '',
      genres: [],
    },
  });

  const { mutate: registerAuthor, isLoading } = trpc.authorRouter.register.useMutation({
    onSuccess: () => {
      toast.success('Success. Please check your email!');
      router.refresh();
      onClose();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <>
      <Button
        onClick={onOpen}
        size='lg'
        color='danger'
        className='absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-foreground-800'
      >
        Become an Author
        <PencilLine className='h-5 w-5' />
      </Button>

      <Modal
        classNames={{
          base: 'mx-0 mb-0 sm:mx-1 sm:my-1 rounded-none sm:rounded-large',
        }}
        backdrop='blur'
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          <form
            onSubmit={handleSubmit((values) => {
              if (values.genres.length === 0) {
                setError('genres', { message: 'Choose from the genre menu' });
                return;
              }
              registerAuthor(values);
            })}
          >
            <ModalHeader>Register as an Author</ModalHeader>
            <ModalBody className='flex w-full items-center justify-center'>
              <CircleImageDropzone onUpload={(publicUrl) => setValue('imageUrl', publicUrl)} />

              <Input
                {...register('authorName')}
                errorMessage={errors.authorName?.message}
                autoFocus
                label='Author Name'
                endContent={<User className='h-5 w-5 fill-foreground-200' />}
                placeholder='Enter author name'
              />
              <Input
                {...register('bio')}
                errorMessage={errors.bio?.message}
                label='Author Bio'
                endContent={<CreditCard className='h-5 w-5 fill-foreground-200' />}
                placeholder='Enter a bio'
              />
              <Select
                {...register('genres')}
                onChange={(e) =>
                  setValue('genres', [...e.target.value.split(',')] as RegisterAuthor['genres'])
                }
                errorMessage={errors.genres?.message}
                isMultiline
                selectionMode='multiple'
                label='Genre'
                placeholder='Enter genres of your expertise'
              >
                {bookGenres.map((genre) => (
                  <SelectItem key={genre} textValue={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </Select>
              <Input
                {...register('confirm_email')}
                errorMessage={errors.confirm_email?.message}
                type='email'
                label='Confirm Email'
                endContent={<Mail className='h-5 w-5 fill-foreground-200' />}
                placeholder='Enter the email you registered with'
              />
            </ModalBody>
            <ModalFooter>
              <Button variant='flat' color='success' isLoading={isLoading} type='submit'>
                Submit
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AuthorRegisterModal;
