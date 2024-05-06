import { type ClassValue, clsx } from 'clsx';
import { MySqlRawQueryResult } from 'drizzle-orm/mysql2';
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

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(priceToConvert);
}

export function calculateAverageRating({
  rating,
  ratingCount,
  scale,
}: {
  rating: number;
  ratingCount: number;
  scale: number;
}) {
  const averageRating = ratingCount > 0 ? rating / ratingCount : 0;

  return (averageRating / scale) * scale;
}

export function renderArrayItemsByComma(array: string[]) {
  return array.map((item, index) => {
    if (index === array.length - 1) {
      return item;
    }
    return item + ',' + ' ';
  });
}

export function DBResult(queryResult: MySqlRawQueryResult[0]) {
  const changedRows = queryResult.info.match(/Changed:\s(\d+)/);

  return { changedRows: Number(changedRows?.[1] || 0), queryResult };
}
