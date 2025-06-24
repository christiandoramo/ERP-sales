// src/lib/store/theme-store.ts
import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'light',
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'light' ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', next === 'dark');
      localStorage.setItem('@theme', next);
      return { theme: next };
    }),
  setTheme: (theme: Theme) => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('@theme', theme);
    set({ theme });
  },
}));
