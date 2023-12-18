'use client';

import { useRouter } from 'next/navigation';
import TRPCProvider from './trpc/TRPCProvider';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider } from 'next-themes';
import { ClerkProvider } from '@clerk/nextjs';

export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <>
      <ClerkProvider>
        <NextUIProvider navigate={router.push}>
          <ThemeProvider attribute='class' defaultTheme='dark' storageKey='theme' enableColorScheme>
            <TRPCProvider>{children}</TRPCProvider>
          </ThemeProvider>
        </NextUIProvider>
      </ClerkProvider>
    </>
  );
}
