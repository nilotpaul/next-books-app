'use client';

import { Button } from '@nextui-org/button';
import { ArrowLeft } from 'lucide-react';
import Link from '../ui/Link';
import { Chip } from '@nextui-org/chip';
import Container from '../ui/Container';

const EditorTopBarSkeleton = () => {
  return (
    <Container className='flex w-full items-center justify-between'>
      <div className='flex items-center gap-12'>
        <Button as={Link} href='/dashboard' variant='bordered'>
          <ArrowLeft className='h-4 w-4' />
          Back
        </Button>
        <Chip color='warning' variant='dot'>
          Draft
        </Chip>
      </div>

      <div className='space-x-4'>
        <Button variant='bordered' className='font-semibold'>
          Save Progress
        </Button>
        <Button color='success' className='font-semibold'>
          Review
        </Button>
      </div>
    </Container>
  );
};

export default EditorTopBarSkeleton;
