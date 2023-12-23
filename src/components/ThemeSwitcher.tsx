'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/utils/utils';

import { Switch, type SwitchProps } from '@nextui-org/switch';
import { SunMedium, Moon } from 'lucide-react';
import { Skeleton } from '@nextui-org/skeleton';

type ThemeSwitcherProps = {
  children?: React.ReactNode;
  size?: SwitchProps['size'];
  className?: string;
  classNames?: SwitchProps['classNames'];
  color?: SwitchProps['color'];
};

export default function ThemeSwitcher({
  children,
  size = 'md',
  color = 'primary',
  className,
  classNames,
}: ThemeSwitcherProps) {
  const [isMounted, setIsMounted] = useState(false);

  const { setTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <>
        <Skeleton
          className={cn('rounded-full', {
            'h-7 w-12': size === 'md',
            'h-6 w-10': size === 'sm',
          })}
        />
      </>
    );
  }
  const defaultTheme = window.localStorage.getItem('theme') ?? 'dark';

  return (
    <Switch
      defaultSelected={defaultTheme === 'light'}
      size={size}
      color={color}
      className={cn('', className)}
      classNames={{
        ...classNames,
      }}
      startContent={<SunMedium />}
      endContent={<Moon />}
      onValueChange={(isSelected) => {
        const theme = isSelected ? 'light' : 'dark';
        setTheme(theme);
      }}
    >
      {children ?? ''}
    </Switch>
  );
}
