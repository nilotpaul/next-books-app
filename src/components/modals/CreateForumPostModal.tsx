'use client';

import { EditorOutput } from '@/types/editor.types';
import { useForm } from 'react-hook-form';
import { ForumPost, forumPostValidation } from '@/validations/forumPostValidations';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '@/lib/trpc/TRPCProvider';
import { toast } from 'sonner';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/navigation';

import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalContent,
  useDisclosure,
} from '@nextui-org/modal';
import { PenSquare } from 'lucide-react';
import { Button } from '@nextui-org/button';
import RectangeImageDropzone from '../dropzones/RectangeImageDropzone';
import { Select, SelectItem } from '@nextui-org/select';

type CreateForumPostModalProps = {
  userId: string;
  isAuthor: boolean;
  requestSubmit: () => Promise<EditorOutput>;
};

const CreateForumPostModal = ({ userId, isAuthor, requestSubmit }: CreateForumPostModalProps) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const router = useRouter();

  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ForumPost>({
    resolver: zodResolver(forumPostValidation),
    mode: 'onChange',
    defaultValues: {
      id: nanoid(),
      content: undefined,
      image: undefined,
      isAuthor,
      postTitle: '',
      tags: [],
    },
  });

  const { mutate: createPost, isLoading } = trpc.forumPostRouter.create.useMutation({
    onSuccess: ({ success }) => {
      if (success) {
        toast.success('Post Created');
      }
      router.push('/dashboard');
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
        className='gap-1.5 text-sm font-semibold'
        startContent={<PenSquare className='h-4 w-4' />}
        size='sm'
        color='success'
        onClick={onOpen}
      >
        Review Post
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop='blur' size='lg'>
        <ModalContent>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const { title, data } = await requestSubmit();

              setValue('postTitle', title);
              setValue('content', data?.blocks);
              handleSubmit((values) => createPost(values))(e);
            }}
          >
            <ModalHeader>Create Forum Post</ModalHeader>

            <ModalBody>
              <RectangeImageDropzone
                label='Post Image'
                onUpload={(imageUrl) => {
                  setValue('image', imageUrl);
                }}
              />
              <Select label='Post Tags' placeholder='Enter tags'>
                <SelectItem key='' textValue=''>
                  ''
                </SelectItem>
              </Select>
            </ModalBody>

            <ModalFooter>
              <Button isLoading={isLoading} type='submit' color='success' className='font-medium'>
                Submit
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateForumPostModal;
