'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

import { Switch } from '@nextui-org/switch';
import { SunMedium, Moon } from 'lucide-react';
import { Spinner } from '@nextui-org/spinner';
import { Skeleton } from '@nextui-org/skeleton';

export default function ThemeSwitcher() {
  const [isMounted, setIsMounted] = useState(false);

  const { setTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <Skeleton className='h-7 w-12 rounded-full' />;
  }
  const defaultTheme = window.localStorage.getItem('theme') ?? 'dark';

  return (
    <div>
      <Switch
        defaultSelected={defaultTheme === 'light'}
        size='md'
        startContent={<SunMedium />}
        endContent={<Moon />}
        onValueChange={(isSelected) => {
          const theme = isSelected ? 'light' : 'dark';
          setTheme(theme);
        }}
      />
    </div>
  );
}
