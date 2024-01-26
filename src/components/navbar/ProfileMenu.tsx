'use client';

import { useRouter } from 'next/navigation';

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  useNavbarContext,
} from '@nextui-org/react';
import { SignOutButton } from '@clerk/nextjs';
import Link from 'next/link';

type ProfileMenu = {
  children: React.ReactNode;
};

const ProfileMenu = ({ children }: ProfileMenu) => {
  const router = useRouter();
  const { setIsMenuOpen } = useNavbarContext();

  return (
    <Dropdown>
      <DropdownTrigger>{children}</DropdownTrigger>

      <DropdownMenu aria-label='User Menu'>
        <DropdownItem
          as={Link}
          onClick={() => setIsMenuOpen(false)}
          key='profile'
          href='/profile'
          className='text-4xl'
        >
          <span className='xs:text-base sm:text-sm'>Profile</span>
        </DropdownItem>
        <DropdownItem as={Link} onClick={() => setIsMenuOpen(false)} key='manage' href='/manage'>
          <span className='xs:text-base sm:text-sm'>Manage</span>
        </DropdownItem>
        <DropdownItem
          as={Link}
          onClick={() => setIsMenuOpen(false)}
          key='dashboard'
          href='/dashboard'
        >
          <span className='xs:text-base sm:text-sm'>Dashboard</span>
        </DropdownItem>
        <DropdownItem key='delete' className='text-danger' color='danger'>
          <span className='xs:text-base sm:text-sm'>
            <SignOutButton signOutCallback={() => router.push('/')} />
          </span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default ProfileMenu;
