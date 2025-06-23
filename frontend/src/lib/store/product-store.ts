// src/lib/store/product-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProductState } from '../interfaces';

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      filters: {
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'asc',
      },
      products: [],
      meta: null,

      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),

      setProducts: (products) => set({ products }),

      setMeta: (meta) => set({ meta }),

      clear: () =>
        set({
          filters: {
            page: 1,
            limit: 10,
            sortBy: 'name',
            sortOrder: 'asc',
          },
          products: [],
          meta: null,
        }),
    }),
    {
      name: 'product-storage', // chave do localStorage
    }
  )
);
