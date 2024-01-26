'use client';

import { useRouter } from 'next/navigation';
import TRPCProvider from './trpc/TRPCProvider';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider, useTheme } from 'next-themes';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'sonner';

export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const theme = useTheme().theme;

  return (
    <>
      <ClerkProvider>
        <NextUIProvider navigate={router.push}>
          <ThemeProvider attribute='class' defaultTheme='dark' storageKey='theme' enableColorScheme>
            <TRPCProvider>
              <Toaster
                richColors
                closeButton
                duration={2500}
                theme={theme === 'dark' ? 'dark' : 'light'}
              />
              {children}
            </TRPCProvider>
          </ThemeProvider>
        </NextUIProvider>
      </ClerkProvider>
    </>
  );
}
