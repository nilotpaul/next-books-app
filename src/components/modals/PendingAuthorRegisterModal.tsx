import { trpc } from '@/lib/trpc/TRPCProvider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { verifyAuthorValidation, type VerifyAuthor } from '@/validations/authorValidations';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@nextui-org/button';
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  useDisclosure,
  ModalContent,
} from '@nextui-org/modal';
import { Input } from '@nextui-org/input';
import { ShieldAlert } from 'lucide-react';

const PendingAuthorRegisterModal = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyAuthor>({
    resolver: zodResolver(verifyAuthorValidation),
    mode: 'onChange',
    defaultValues: {
      secretKey: '',
    },
  });

  const { mutate: verifyAuthor, isLoading } = trpc.authorRouter.verify.useMutation({
    onSuccess: () => {
      toast.success('Successfully verified');
      router.refresh();
      onClose();
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
        size='lg'
        color='warning'
        className='absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 gap-1.5 font-medium text-black/80'
      >
        Verify
        <ShieldAlert className='h-5 w-5 text-danger' />
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            <form onSubmit={handleSubmit((values) => verifyAuthor(values))}>
              <ModalHeader>Verify to become an author</ModalHeader>
              <ModalBody>
                <Input
                  {...register('secretKey')}
                  errorMessage={errors.secretKey?.message}
                  type='password'
                  label='Secret Key'
                  placeholder='Enter the key that we emailed you'
                />
              </ModalBody>
              <ModalFooter>
                <Button type='submit' color='success' isLoading={isLoading}>
                  Submit
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </Button>
    </>
  );
};

export default PendingAuthorRegisterModal;
