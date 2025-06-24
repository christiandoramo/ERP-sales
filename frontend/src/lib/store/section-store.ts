// src/lib/store/section-store.ts
import { create } from 'zustand';

type Section = 'dashboard' | 'products' | 'reports' | 'admin';

interface SectionState {
  current: Section;
  setSection: (section: Section) => void;
}

export const useSectionStore = create<SectionState>((set) => ({
  current: 'products',
  setSection: (section) => set({ current: section }),
}));
