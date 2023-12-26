import Container from '@/components/ui/Container';
import { Button } from '@nextui-org/button';
import { Chip } from '@nextui-org/chip';
import { ArrowLeft } from 'lucide-react';
import Link from '@/components/ui/Link';

type TopbarProps = {};

const Topbar = ({}: TopbarProps) => {
  return (
    <Container className='flex w-full items-center justify-between'>
      <div className='flex items-center gap-12'>
        <Button as={Link} href='/' variant='bordered'>
          <ArrowLeft className='h-4 w-4' />
          Back
        </Button>
        <Chip color='warning' variant='dot'>
          Draft
        </Chip>
      </div>

      <Button color='success' className='font-semibold'>
        Save
      </Button>
    </Container>
  );
};

export default Topbar;
