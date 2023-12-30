import { useEffect, useState } from 'react';
import { Book } from '@/types/book.types';
import { bookGenres } from '@/config/constants/author';
import { BOOK_AVAILABALITY, BOOK_LANGUAGES } from '@/config/constants/books';
import { useForm } from 'react-hook-form';
import { type PublishBook, publishBookValidation } from '@/validations/bookValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { EditorOutput } from '@/types/editor.types';
import { useRouter } from 'next/navigation';

import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { Switch } from '@nextui-org/switch';
import { cn } from '@/utils/utils';
import { Select, SelectItem } from '@nextui-org/select';
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete';
import { Input } from '@nextui-org/input';
import RectangeImageDropzone from '../dropzones/RectangeImageDropzone';
import { toast } from 'sonner';
import Image from '../ui/Image';
import { trpc } from '@/lib/trpc/TRPCProvider';

type BookPublishModalProps = {
  book: Omit<Book, 'normalised_title' | 'stars' | 'updatedAt' | 'publicationDate'>;
  requestSubmit: () => Promise<EditorOutput>;
};

const BookPublishModal = ({ book, requestSubmit }: BookPublishModalProps) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isSelected, setIsSelected] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PublishBook>({
    resolver: zodResolver(publishBookValidation),
    mode: 'onChange',
    defaultValues: {
      bookId: book.id,
      bookTitle: '',
      content: undefined,
      language: undefined,
      status: isSelected ? 'published' : 'draft',
      series: [],
      genres: book.genres || [],
      frontArtwork: book?.frontArtwork || '',
      backArtwork: book?.backArtwork || '',
      collaborations: [],
      availability: 'Free',
      pricing: '00.00',
    },
  });

  const isError = !Object.values(errors).every((err) => !err?.message);

  useEffect(() => {
    const msg = Object.values(errors).filter((err) => err?.message)[0];
    if (isError) {
      toast.error(`Please fill all the inputs in the settings. (${msg?.message})`);
    }
  }, [isError, errors]);

  const { mutate: publishBook, isLoading } = trpc.bookRouter.publish.useMutation({
    onSuccess: () => {
      toast.success(`${!isSelected ? 'Successfully saved the book as draft' : 'Book Published'}`);
      router.push('/dashboard');
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.message);
    },
  });

  return (
    <>
      <Button variant='bordered' className='font-semibold'>
        Save Progress
      </Button>
      <Button onClick={onOpen} color='success' className='font-semibold'>
        Review
      </Button>
      <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='5xl' className='overflow-y-auto'>
          <ModalContent>
            <ModalHeader>Book Settings</ModalHeader>

            <ModalBody>
              <div className='grid grid-cols-2 gap-4'>
                <div className='relative'>
                  {book.frontArtwork && (
                    <Image
                      src={book.frontArtwork}
                      alt='Front Artwork'
                      radius='sm'
                      height={160}
                      width={160}
                      className='absolute -right-1/2 z-10 h-[10rem] w-full translate-x-1/2'
                    />
                  )}
                  <RectangeImageDropzone
                    label={!book.frontArtwork ? 'Front Cover Artwork' : ''}
                    onUpload={(imageUrl) => {
                      setValue('frontArtwork', imageUrl);
                      toast.success('Image uploaded successfully');
                    }}
                  />
                </div>

                <div className='relative'>
                  {book.backArtwork && (
                    <Image
                      src={book.backArtwork}
                      alt='Front Artwork'
                      radius='sm'
                      height={160}
                      width={160}
                      className='absolute -right-1/2 z-10 h-[10rem] w-full translate-x-1/2'
                    />
                  )}
                  <RectangeImageDropzone
                    label={!book.backArtwork ? 'Back Cover Artwork' : ''}
                    onUpload={(imageUrl) => {
                      setValue('backArtwork', imageUrl);
                      toast.success('Image uploaded successfully');
                    }}
                  />
                </div>
              </div>

              <div className='grid grid-cols-3 gap-3'>
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
                    setValue('genres', [...e.target?.value.split(',')] as PublishBook['genres'])
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
                  <SelectItem key={''}>''</SelectItem>
                </Select>
                <Select
                  defaultSelectedKeys={book.collaborations || []}
                  {...register('collaborations')}
                  multiple
                  selectionMode='multiple'
                  label='Collaborations'
                  placeholder='Give credit to other author(s)'
                >
                  <SelectItem key={''} textValue={''}>
                    ''
                  </SelectItem>
                </Select>
              </div>
              <div className='flex items-center justify-between'>
                <Switch
                  defaultChecked={book.status === 'published'}
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
                  onClick={async (e) => {
                    e.preventDefault();
                    const { title, data } = await requestSubmit();
                    setValue('bookTitle', title);
                    setValue('content', data?.blocks);

                    handleSubmit((values) => publishBook(values))(e);
                  }}
                  isLoading={isLoading}
                  color={!isSelected ? 'secondary' : 'warning'}
                  className='font-medium'
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
