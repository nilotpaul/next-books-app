import { useEffect, useState } from 'react';
import { Book } from '@/types/book.types';
import { bookGenres } from '@/config/constants/author';
import { BOOK_AVAILABALITY, BOOK_LANGUAGES } from '@/config/constants/books';
import { useForm } from 'react-hook-form';
import {
  type PublishBook,
  publishBookValidation,
  DraftBook,
  draftBookValidation,
} from '@/validations/bookValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { EditorOutput } from '@/types/editor.types';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc/TRPCProvider';

import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { Switch } from '@nextui-org/switch';
import { cn } from '@/utils/utils';
import { Select, SelectItem } from '@nextui-org/select';
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete';
import { Input, Textarea } from '@nextui-org/input';
import RectangeImageDropzone from '../dropzones/RectangeImageDropzone';
import { toast } from 'sonner';

type BookPublishModalProps = {
  book: Omit<Book, 'normalised_title' | 'stars' | 'updatedAt' | 'publicationDate'>;
  requestSubmit: () => Promise<EditorOutput>;
};

const BookPublishModal = ({ book, requestSubmit }: BookPublishModalProps) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isSelected, setIsSelected] = useState(book.status === 'published' || false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PublishBook | DraftBook>({
    resolver: zodResolver(isSelected ? publishBookValidation : draftBookValidation),
    mode: 'onChange',
    defaultValues: {
      bookId: book.id,
      bookTitle: '',
      content: undefined,
      synopsis: book.synopsis || undefined,
      language: book.language || undefined,
      status: book.status || (isSelected ? 'published' : 'draft'),
      series: book.series || [],
      genres: book.genres || [],
      frontArtwork: book?.frontArtwork || undefined,
      backArtwork: book?.backArtwork || undefined,
      collaborations: book.collaborations || [],
      availability: book.availability || 'Free',
      pricing: book.pricing || '00.00',
    },
  });

  const { mutate: publishBook, isLoading } = trpc.bookRouter.publish.useMutation({
    onSuccess: () => {
      toast.success(`${!isSelected ? 'Successfully saved the book as draft' : 'Book Published'}`);
      if (!isSelected) {
        router.refresh();
        onClose();
        return;
      }
      router.push('/dashboard');
      router.refresh();
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.message);
    },
  });

  useEffect(() => {
    if (Object.keys(errors).length) {
      Object.entries(errors).forEach(([_, value]) => {
        toast.error(value.message?.toString());
      });
    }
  }, [errors]);

  const onSubmit = async (values: PublishBook | DraftBook) => {
    const { title, data } = await requestSubmit();
    setValue('bookTitle', title);
    setValue('content', data?.blocks);

    if (values.pricing === '0.00' && values.availability === 'Paid') {
      toast.error('For a paid book, price cannot be zero');
      return;
    }

    publishBook(values);
  };

  return (
    <>
      <Button onClick={onOpen} color='success' className='font-semibold'>
        Review
      </Button>
      <>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          size='5xl'
          scrollBehavior='inside'
          className='overflow-y-auto'
        >
          <ModalContent>
            <ModalHeader>Book Settings</ModalHeader>
            <ModalBody>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className='relative'>
                  <RectangeImageDropzone
                    initialImage={book.frontArtwork || ''}
                    label={!book.frontArtwork ? 'Front Cover Artwork' : ''}
                    onUpload={(imageUrl) => {
                      setValue('frontArtwork', imageUrl);
                      toast.success('Image uploaded successfully');
                    }}
                  />
                </div>

                <div className='relative'>
                  <RectangeImageDropzone
                    initialImage={book.backArtwork || ''}
                    label={!book.backArtwork ? 'Back Cover Artwork' : ''}
                    onUpload={(imageUrl) => {
                      setValue('backArtwork', imageUrl);
                      toast.success('Image uploaded successfully');
                    }}
                  />
                </div>
              </div>

              <Textarea
                {...register('synopsis')}
                defaultValue={book.synopsis || ''}
                minRows={3}
                label='Synopsis'
                placeholder='Enter a brief description about the book'
              />
              <div className='grid grid-cols-1 gap-3 xs:grid-cols-2 md:grid-cols-3'>
                <Autocomplete
                  defaultInputValue={book.language}
                  {...register('language')}
                  label='Book Language'
                  placeholder='Select a language for your book'
                >
                  {BOOK_LANGUAGES.slice().map((item, index) => (
                    <AutocompleteItem key={`${item}-${index}`} value={item}>
                      {item}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
                <Select
                  defaultSelectedKeys={book?.genres || []}
                  {...register('genres')}
                  onChange={(e) =>
                    setValue('genres', [
                      ...(e.target?.value.split(',') || []),
                    ] as PublishBook['genres'])
                  }
                  multiple
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
                <Select
                  defaultSelectedKeys={[book.availability || 'Free']}
                  {...register('availability')}
                  label='Book Availabality'
                  placeholder='Publish book free or paid?'
                >
                  {BOOK_AVAILABALITY.map((item) => (
                    <SelectItem key={item} textValue={item}>
                      {item}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  errorMessage={errors.pricing?.message}
                  defaultValue={book?.pricing || '00.00'}
                  {...register('pricing')}
                  type='number'
                  min={0}
                  step={0.01}
                  endContent={
                    <p className='flex items-center gap-1 text-small text-default-400'>
                      <span>$</span> USD
                    </p>
                  }
                  label='Book Pricing'
                  placeholder='Set a price for your book'
                />
                <Select
                  defaultSelectedKeys={book.series}
                  {...register('series')}
                  label='Series'
                  placeholder='Select if this book is a part of a series'
                >
                  <SelectItem key={''}></SelectItem>
                </Select>
                <Select
                  defaultSelectedKeys={book.collaborations || []}
                  {...register('collaborations')}
                  multiple
                  selectionMode='multiple'
                  label='Collaborations'
                  placeholder='Give credit to other author(s)'
                >
                  <SelectItem key={''} textValue={''}></SelectItem>
                </Select>
              </div>
              <div className='flex flex-wrap items-center justify-between gap-5'>
                <Switch
                  {...register('status')}
                  isSelected={isSelected}
                  onValueChange={(value) => {
                    setIsSelected(value);
                    setValue('status', !isSelected ? 'published' : 'draft');
                  }}
                  color='danger'
                  classNames={{
                    base: cn(
                      'inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center',
                      'justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent',
                      'data-[selected=true]:border-primary'
                    ),
                    wrapper: 'p-0 h-4 overflow-visible',
                    thumb: cn(
                      'w-6 h-6 border-2 shadow-lg',
                      'group-data-[hover=true]:border-primary',
                      'group-data-[selected=true]:ml-6',
                      'group-data-[pressed=true]:w-7',
                      'group-data-[selected]:group-data-[pressed]:ml-4'
                    ),
                  }}
                >
                  <div className='flex flex-col gap-1'>
                    <p className='text-medium'>
                      Publish Book{' '}
                      <span className='text-sm font-medium text-danger'>
                        ({isSelected ? 'Publishing' : 'Draft'})
                      </span>
                    </p>
                    <p className='text-tiny text-default-400'>
                      Currenly it is in draft. Please toggle the switch to publish!
                    </p>
                  </div>
                </Switch>

                <Button
                  onClick={handleSubmit(onSubmit)}
                  isLoading={isLoading}
                  color={!isSelected ? 'secondary' : 'warning'}
                  className='w-full font-medium'
                >
                  {!isSelected ? 'Save as Draft' : 'Publish'}
                </Button>
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    </>
  );
};

export default BookPublishModal;
