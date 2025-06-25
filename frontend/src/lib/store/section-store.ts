// src/lib/store/section-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';


type Section = 'dashboard' | 'products' | 'reports' | 'admin' | 'create-product' | 'edit-product';

interface SectionState {
  current: Section;
  setSection: (section: Section) => void;
}


export const useSectionStore = create<SectionState>()(
  persist(
    (set) => ({
      current: 'products',
      setSection: (section) => set({ current: section }),
    }),
    {
      name: 'section-storage', // nome da key no localStorage
    }
  )
);
