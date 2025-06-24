// // src/lib/store/product-store.ts
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import { ProductState } from '../interfaces';

// export const useProductStore = create<ProductState>()(
//   persist(
//     (set) => ({
//       filters: {
//         page: 1,
//         limit: 10,
//         // sortBy: 'name',
//         // sortOrder: 'asc',
//       },
//       products: [],
//       meta: null,

//       setFilters: (newFilters) =>
//         set((state) => ({
//           filters: { ...state.filters, ...newFilters },
//         })),

//       setProducts: (products) => set({ products }),

//       setMeta: (meta) => set({ meta }),

//       clear: () =>
//         set({
//           filters: {
//             page: 1,
//             limit: 10,
//             // sortBy: 'name',
//             // sortOrder: 'asc',
//           },
//           products: [],
//           meta: null,
//         }),
//     }),
//     {
//       name: 'product-storage', // chave do localStorage
//     }
//   )
// );

// src/lib/store/product-store.ts
import { create } from 'zustand';
import { ProductItem } from '../schemas/index-products';

export type ProductSection = 'table' | 'create';

interface ProductStoreState {
  products: ProductItem[];
  meta?: { totalItems: number };
  filters: any;
  section: ProductSection;
  setSection: (section: ProductSection) => void;
  setProducts: (data: ProductItem[]) => void;
  setMeta: (meta: { totalItems: number }) => void;
  setFilters: (filters: any) => void;
}

export const useProductStore = create<ProductStoreState>((set) => ({
  products: [],
  meta: undefined,
  filters: {
    page: 1,
    limit: 10,
  },
  section: 'table',
  setSection: (section) => set({ section }),
  setProducts: (data) => set({ products: data }),
  setMeta: (meta) => set({ meta }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
}));
