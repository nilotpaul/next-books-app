'use client';

import { Image as NextUIImage, type ImageProps as NextUIImageProps } from '@nextui-org/image';
import NextImage, { ImageProps as NextImageProps } from 'next/image';

type ImageProps = NextUIImageProps & NextImageProps;

const Image = ({ ...props }: ImageProps) => {
  return <NextUIImage as={NextImage} {...props} />;
};

export default Image;
