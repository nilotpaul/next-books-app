import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normaliseTitle(title: string) {
  const normalised_title = title.replace(/\s+/g, '');

  return normalised_title;
}

export function capitalizeString(string: string) {
  const firstLetter = string.charAt(0).toUpperCase();
  const rest = string.slice(1);

  return firstLetter + rest;
}

export function convertPrice(price: string | number) {
  const priceToConvert = Number(price);

  return priceToConvert.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
}
