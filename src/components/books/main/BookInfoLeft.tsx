import Image from '@/components/ui/Image';

type BookInfoLeftProps = {
  frontArtwork: string;
  backArtwork: string;
  title: string;
};

const BookInfoLeft = ({ backArtwork, frontArtwork, title }: BookInfoLeftProps) => {
  return (
    <Image
      src={frontArtwork}
      alt={title}
      height={2600}
      width={1600}
      classNames={{
        wrapper: 'static',
      }}
      className='max-h-[700px]'
    />
  );
};

export default BookInfoLeft;
