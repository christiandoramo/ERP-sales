// src/lib/hooks/use-loading.ts
import { create } from 'zustand';
import { LoadingState } from '../interfaces';

export const useLoading = create<LoadingState>((set) => ({
  loading: false,
  setLoading: (value) => set({ loading: value }),
}));