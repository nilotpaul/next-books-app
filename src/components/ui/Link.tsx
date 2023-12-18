'use client';

import { Link as NextUILink, type LinkProps as NextUILinkProps } from '@nextui-org/link';
import NextLink, { type LinkProps as NextLinkProps } from 'next/link';

type LinkProps = NextUILinkProps & NextLinkProps;

const Link = ({ children, ...props }: { children: React.ReactNode } & LinkProps) => {
  return (
    <NextUILink as={NextLink} {...props}>
      {children}
    </NextUILink>
  );
};

export default Link;
