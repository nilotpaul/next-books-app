'use client';

import { useEditor } from '@/hooks/useEditor';

import CreateForumPostModal from '@/components/modals/CreateForumPostModal';
import Container from '@/components/ui/Container';
import Link from '@/components/ui/Link';
import { Button } from '@nextui-org/button';
import { ArrowLeft } from 'lucide-react';
import Editor from '../editor/Editor';

type CreatePostWrapperProps = {
  userId: string;
  isAuthor: boolean;
};

const CreatePostWrapper = ({ userId, isAuthor }: CreatePostWrapperProps) => {
  const { requestSubmit, ...rest } = useEditor();

  return (
    <>
      <Container className='flex w-full items-center justify-between px-0'>
        <div className='flex items-center gap-12'>
          <Button as={Link} href='/dashboard' variant='bordered'>
            <ArrowLeft className='h-4 w-4' />
            Back
          </Button>
        </div>
        <div className='space-x-3'>
          <CreateForumPostModal userId={userId} isAuthor={isAuthor} requestSubmit={requestSubmit} />
        </div>
      </Container>

      <div className='mt-8'>
        <Editor
          {...rest}
          label={{ titleBar: 'Post Title', editor: 'Post Content' }}
          placeholder={{
            titleBar: 'Enter post title here',
            editor: 'Start Writing...',
          }}
        />
      </div>
    </>
  );
};

export default CreatePostWrapper;
