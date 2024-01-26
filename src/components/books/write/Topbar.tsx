import { Book } from '@/types/book.types';
import { EditorOutput } from '@/types/editor.types';

import { Button } from '@nextui-org/button';
import { Chip } from '@nextui-org/chip';
import { ArrowLeft } from 'lucide-react';
import Link from '@/components/ui/Link';
import Container from '@/components/ui/Container';
import BookPublishModal from '@/components/modals/BookPublishModal';

type TopbarProps = {
  book: Omit<Book, 'normalised_title' | 'stars' | 'updatedAt' | 'publicationDate'>;
  requestSubmit: () => Promise<EditorOutput>;
};

const Topbar = ({ ...props }: TopbarProps) => {
  return (
    <Container className='flex w-full max-w-full items-center justify-between px-0 md:max-w-5xl'>
      <div className='flex items-center gap-12'>
        <Button as={Link} href='/dashboard' variant='bordered' className='hidden md:flex'>
          <ArrowLeft className='h-4 w-4' />
          Back
        </Button>
        <Chip color='warning' variant='dot'>
          Draft
        </Chip>
      </div>
      <div className='space-x-3'>
        <BookPublishModal {...props} />
      </div>
    </Container>
  );
};

export default Topbar;
