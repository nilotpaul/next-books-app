import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normaliseTitle(title: string) {
  const normalised_title = title.replace(/\s+/g, '');

  return normalised_title;
}
