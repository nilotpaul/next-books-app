'use client';

import { useState } from 'react';

import { usePathname } from 'next/navigation';
import Link from '../ui/Link';

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
import BrandLogo from '../BrandLogo';

type DashNavbarProps = {
  children: React.ReactNode;
};

const DashNavbar = ({ children }: DashNavbarProps) => {
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
      <Container className='flex w-full items-center gap-12'>
        <NavbarBrand className='sm:min-w-fit sm:max-w-fit'>
          <BrandLogo />
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
                  color='primary'
                  className='text-[0.95rem] leading-6'
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

        <NavbarMenu className='gap-3 font-medium'>
          {dashNavItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <NavbarMenuItem key={item.path} isActive={isActive}>
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  color='primary'
                  underline={isActive ? 'always' : 'none'}
                  href={item.path}
                  className='text-base xs:text-lg sm:text-base'
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
