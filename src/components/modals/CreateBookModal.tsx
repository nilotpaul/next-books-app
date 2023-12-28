import { useForm } from 'react-hook-form';
import { type CreateBook, createBookValidation } from '@/validations/bookValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '@/lib/trpc/TRPCProvider';
import { useRouter } from 'next/navigation';

import { Button } from '@nextui-org/button';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  useDisclosure,
} from '@nextui-org/modal';
import { Input } from '@nextui-org/input';
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete';
import { Plus } from 'lucide-react';
import { BOOK_LANGUAGES } from '@/config/constants/books';
import { toast } from 'sonner';

type CreateBookModalProps = {
  userId: string;
};

const CreateBookModal = ({ userId }: CreateBookModalProps) => {
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBook>({
    resolver: zodResolver(createBookValidation),
    mode: 'onChange',
    defaultValues: {
      bookTitle: '',
      language: undefined,
    },
  });

  const { mutate: createBook, isLoading } = trpc.bookRouter.create.useMutation({
    onSuccess: ({ bookId }) => {
      router.refresh();
      onClose();
      router.push(`/books/write/${userId}/${bookId}`);
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });

  return (
    <>
      <Button
        onClick={onOpen}
        variant='solid'
        color='success'
        size='sm'
        startContent={<Plus className='h-4 w-4 font-extrabold' />}
        className='gap-1.5 text-small font-semibold text-black'
      >
        Write Book
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <form onSubmit={handleSubmit((values) => createBook(values))}>
            <ModalHeader>Write Book</ModalHeader>
            <ModalBody>
              <Input
                {...register('bookTitle')}
                errorMessage={errors.bookTitle?.message}
                autoFocus
                type='text'
                label='Book Title'
                placeholder='Enter the title of your book'
              />
              <Autocomplete
                {...register('language')}
                errorMessage={errors.language?.message}
                label='Book Language'
                placeholder='Select a language for your book'
              >
                {BOOK_LANGUAGES.slice().map((item, index) => (
                  <AutocompleteItem key={`${item}-${index}`} value={item}>
                    {item}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </ModalBody>
            <ModalFooter>
              <Button type='submit' color='success' isLoading={isLoading} className='font-medium'>
                Submit
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateBookModal;
