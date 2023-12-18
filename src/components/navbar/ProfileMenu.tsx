'use client';

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { SignOutButton } from '@clerk/nextjs';
import Link from 'next/link';

type ProfileMenu = {
  children: React.ReactNode;
};

const ProfileMenu = ({ children }: ProfileMenu) => {
  return (
    <Dropdown>
      <DropdownTrigger>{children}</DropdownTrigger>
      <DropdownMenu aria-label='Profile Menu'>
        <DropdownItem as={Link} key='profile' href='/profile'>
          Profile
        </DropdownItem>
        <DropdownItem key='delete' className='text-danger' color='danger'>
          <SignOutButton />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default ProfileMenu;
