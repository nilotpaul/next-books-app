import { useEffect, useState } from 'react';
import { Book } from '@/types/book.types';
import { bookGenres } from '@/config/constants/author';
import { BOOK_AVAILABALITY, BOOK_LANGUAGES } from '@/config/constants/books';
import { useForm } from 'react-hook-form';
import { type PublishBook, publishBookValidation } from '@/validations/bookValidation';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { Switch } from '@nextui-org/switch';
import { cn } from '@/utils/utils';
import { Select, SelectItem } from '@nextui-org/select';
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete';
import { Input } from '@nextui-org/input';
import RectangeImageDropzone from '../dropzones/RectangeImageDropzone';
import { toast } from 'sonner';
import Image from '../ui/Image';

type BookPublishModalProps = {
  book: Omit<Book, 'normalised_title' | 'stars' | 'updatedAt' | 'publicationDate'>;
};

const BookPublishModal = ({ book }: BookPublishModalProps) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isSelected, setIsSelected] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PublishBook>({
    // resolver: zodResolver(publishBookValidation),
    mode: 'onChange',
    defaultValues: {
      bookTitle: '',
      content: undefined,
      status: isSelected ? 'published' : 'draft',
      genres: [],
      series: '',
      frontArtwork: '',
      backArtwork: '',
      language: undefined,
      availability: undefined,
      pricing: undefined,
      collaborations: [],
    },
  });

  return (
    <>
      <Button onClick={onOpen} variant='bordered' className='font-medium'>
        Settings
      </Button>

      <Button
        color='success'
        className='font-semibold'
        onClick={(e) => {
          handleSubmit((values) => console.log(values))(e);
          const isError = Boolean(!Object.values(errors).every((err) => !err?.message));
          if (isError) {
            console.error(errors);
            toast.error('Please go into settings and fill all fields');
          }
        }}
      >
        Save
      </Button>
      <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='5xl' className='overflow-y-auto'>
          <ModalContent>
            <form onSubmit={handleSubmit((values) => console.log(values))}>
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
                        className='absolute -right-1/2 z-20 w-full translate-x-1/2'
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
                        className='absolute -right-1/2 z-20 w-full translate-x-1/2'
                      />
                    )}
                    <RectangeImageDropzone
                      label='Back Cover Artwork'
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
                    defaultSelectedKeys={book.availability || []}
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
                    defaultValue={book?.pricing || undefined}
                    {...register('pricing')}
                    onChange={(e) => setValue('pricing', Number(e.target.value))}
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
                    {bookGenres.map((genre) => (
                      <SelectItem key={genre} textValue={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
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
              </ModalBody>
            </form>
          </ModalContent>
        </Modal>
      </>
    </>
  );
};

export default BookPublishModal;
