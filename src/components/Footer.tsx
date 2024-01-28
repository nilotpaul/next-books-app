import { navItems } from '@/config/constants/navMenu';
import BrandLogo from './BrandLogo';
import Link from './ui/Link';
import Container from './ui/Container';
import githubLogo from '../../public/github-mark.svg';
import Image from 'next/image';
import Divider from './ui/Divider';

const Footer = () => {
  return (
    <Container className='flex w-full flex-col gap-y-4 pb-12 pt-32'>
      <BrandLogo
        classNames={{ logo1: 'text-2xl', logo2: 'text-2xl', main: 'w-fit cursor-default' }}
      />

      <Divider className='bg-default-100' />

      <div className='mt-2'>
        <div className='flex flex-col items-center justify-between gap-8 sm:flex-row'>
          <div className='flex flex-wrap items-center justify-center gap-8 sm:items-start sm:justify-normal'>
            {navItems.map((item) => (
              <Link
                className='font-semibold'
                color='primary'
                underline='always'
                key={item.path}
                href={item.path}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <Link target='_blank' href='https://github.com/nilotpaul/next-books-app'>
            <Image
              className='rounded-full dark:bg-foreground'
              src={githubLogo}
              height={30}
              width={30}
              alt='GitHub Logo'
            />
          </Link>
        </div>

        <div className='prose prose-sm mt-12 text-center font-medium leading-none text-foreground-600 sm:text-start'>
          <p className='text-base text-black dark:text-inherit'>
            Next.js side project developed by{' '}
            <Link
              className='text-base text-black hover:underline dark:text-foreground-600'
              target='_blank'
              href='https://github.com/nilotpaul'
            >
              Nilotpaul Nandi
            </Link>
          </p>
          <p className='dark:text-foreground-500 sm:-mt-2'>
            Copyright &copy; {new Date().getFullYear()} BooksGod
          </p>
        </div>
      </div>
    </Container>
  );
};

export default Footer;
