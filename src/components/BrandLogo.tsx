import { cn } from '@/utils/utils';
import Link from 'next/link';

type BrandLogoProps = {
  classNames?: {
    main?: string;
    logo1?: string;
    logo2?: string;
  };
};

const BrandLogo = ({ classNames }: BrandLogoProps) => {
  return (
    <Link
      href='/'
      className={cn('text-[0.9rem] font-bold text-gray-100 xs:text-base', classNames?.main)}
    >
      <span className={cn('text-danger', classNames?.logo1)}>BOOKS</span>
      <span className={cn('text-foreground-700', classNames?.logo2)}>God</span>
    </Link>
  );
};

export default BrandLogo;
