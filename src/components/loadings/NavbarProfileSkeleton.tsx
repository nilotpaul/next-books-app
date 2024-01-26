import { Button } from '@nextui-org/button';
import { Skeleton } from '@nextui-org/react';
import { Search } from 'lucide-react';

const NavbarProfileSkeleton = () => {
  return (
    <div className='flex items-center gap-3'>
      <Button size='sm' isIconOnly radius='md'>
        <Search className='h-5 w-5' />
      </Button>
      <Skeleton className='h-8 w-8 rounded-full' />
    </div>
  );
};

export default NavbarProfileSkeleton;
