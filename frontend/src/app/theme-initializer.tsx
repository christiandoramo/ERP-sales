'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/lib/store/theme-store';

export function ThemeInitializer() {
  const { setTheme } = useThemeStore();

  useEffect(() => {
    const theme = (localStorage.getItem('@theme') as 'light' | 'dark') || 'light';
    setTheme(theme);
  }, []);

  return null;
}
