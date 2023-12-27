'use client';

import { usePathname } from 'next/navigation';
import Link from '../ui/Link';
import NextLink from 'next/link';

import {
  Navbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from '@nextui-org/navbar';
import Container from '../ui/Container';
import { dashNavItems } from '@/config/constants/navMenu';

type DashNavbarProps = {
  children: React.ReactNode;
};

const DashNavbar = ({ children }: DashNavbarProps) => {
  const pathname = usePathname();
  return (
    <Navbar
      maxWidth='full'
      isBlurred
      isBordered
      position='sticky'
      className='h-14 sm:h-16'
      classNames={{
        wrapper: 'px-0',
      }}
    >
      <Container className='flex w-full items-center gap-12'>
        <NavbarBrand className='sm:min-w-fit sm:max-w-fit'>
          <NextLink href='/' className='font-bold text-gray-100'>
            <span className='text-danger'>BOOKS</span>
            <span className='text-foreground-700'>God</span>
          </NextLink>
        </NavbarBrand>

        <NavbarContent className='hidden gap-4 font-medium sm:flex'>
          {dashNavItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <NavbarItem key={item.path} isActive={isActive}>
                <Link
                  isBlock
                  underline={isActive ? 'always' : 'none'}
                  href={item.path}
                  size='md'
                  color='foreground'
                  className='text-[0.95rem] leading-6 text-foreground-600'
                >
                  {item.name}
                </Link>
              </NavbarItem>
            );
          })}
        </NavbarContent>

        <NavbarContent className='hidden sm:flex' justify='end'>
          {children}
        </NavbarContent>

        <NavbarMenuToggle className='sm:hidden' />

        <NavbarMenu className='font-medium'>
          {dashNavItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <NavbarMenuItem
                key={item.path}
                isActive={isActive}
                className='mt-1 flex w-full items-center justify-center'
              >
                <Link
                  color='foreground'
                  underline={isActive ? 'always' : 'none'}
                  href={item.path}
                  className='text-foreground-600'
                >
                  {item.name}
                </Link>
              </NavbarMenuItem>
            );
          })}

          <NavbarMenuItem>{children}</NavbarMenuItem>
        </NavbarMenu>
      </Container>
    </Navbar>
  );
};

export default DashNavbar;
