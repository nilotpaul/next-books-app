import { Roboto, Open_Sans, Lato, Palanquin_Dark, Inter, Montserrat } from 'next/font/google';

export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
});

export const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
});

export const inter = Inter({ subsets: ['latin'] });

export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});
