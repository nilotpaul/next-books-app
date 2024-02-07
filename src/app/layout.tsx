import { constructMetadata } from '@/lib/constructMetadata';
import { inter } from '@/config/fonts';

import Providers from '@/lib/Providers';
import GradiantBlob from '@/components/ui/GradiantBlob';
import { cn } from '@/utils/utils';

import './globals.css';

export const metadata = constructMetadata({
  title: {
    default: 'BooksGod',
    template: `%s | BooksGod`,
  },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className='scroll-smooth'>
      <body className={cn('min-h-screen max-w-full scroll-smooth antialiased', inter.className)}>
        <Providers>
          <GradiantBlob />

          {children}
        </Providers>
      </body>
    </html>
  );
}
