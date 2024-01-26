'use client';

import { usePathname } from 'next/navigation';
import Link from '../ui/Link';
import { Suspense, useState } from 'react';

import {
  Navbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from '@nextui-org/navbar';
import { navItems } from '@/config/constants/navMenu';
import Container from '../ui/Container';
import NavbarProfileSkeleton from '../loadings/NavbarProfileSkeleton';
import { Button } from '@nextui-org/button';
import BrandLogo from '../BrandLogo';

type HeaderProps = {
  children: React.ReactNode;
};

const Header = ({ children }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth='full'
      isBlurred
      isBordered
      position='sticky'
      className='h-16'
      classNames={{
        wrapper: 'px-0',
      }}
    >
      <Container className='flex w-full items-center'>
        <NavbarBrand>
          <BrandLogo />
        </NavbarBrand>

        <NavbarContent className='hidden gap-4 font-medium sm:flex' justify='center'>
          {navItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <NavbarItem key={item.path} isActive={isActive}>
                <Link isBlock underline={isActive ? 'always' : 'none'} href={item.path} size='md'>
                  {item.name}
                </Link>
              </NavbarItem>
            );
          })}
        </NavbarContent>

        <NavbarContent className='hidden sm:flex' justify='end'>
          <Suspense fallback={<NavbarProfileSkeleton />}>{children}</Suspense>
        </NavbarContent>

        <Button
          as={NavbarMenuToggle}
          isIconOnly
          size='sm'
          className='w-fit bg-transparent sm:hidden'
        />

        <NavbarMenu className='flex w-full flex-col items-start gap-4 xs:gap-6'>
          {navItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <NavbarMenuItem key={item.path} isActive={isActive}>
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  className='font-medium xs:text-xl'
                  underline={isActive ? 'always' : 'none'}
                  href={item.path}
                >
                  {item.name}
                </Link>
              </NavbarMenuItem>
            );
          })}

          <NavbarMenuItem className='w-full'>
            <Suspense fallback={<NavbarProfileSkeleton />}>{children}</Suspense>
          </NavbarMenuItem>
        </NavbarMenu>
      </Container>
    </Navbar>
  );
};

export default Header;
