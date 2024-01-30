import getUrl from '@/utils/getUrl';
import { Metadata } from 'next';

type TitleTemplate = {
  default: string;
  template: string;
  absolute?: string;
};

export function constructMetadata({
  title = 'BooksGod',
  description = 'Discover, read, and write books effortlessly with BooksGod. Explore a curated collection, unleash your creativity as an author, and enjoy seamless interactions.',
  image = '/booksgod.png',
  icons = '/favicon.ico',
  noIndex = false,
}: {
  title?: string | TitleTemplate;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          alt: typeof title === 'string' ? title : undefined,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: image }],
      creator: '@NilotpaulN',
    },
    icons,
    metadataBase: new URL(getUrl('')),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
    creator: 'Nilotpaul Nandi',
    authors: [{ name: 'Nilotpaul Nandi', url: 'https://github.com/nilotpaul' }],
  };
}
