// src/lib/store/product-store.ts
import { create } from 'zustand';

type ProductFilters = {
  page: number;
  limit: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  hasDiscount?: boolean;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  includeDeleted?: boolean;
  onlyOutOfStock?: boolean;
  withCouponApplied?: boolean;
};

type ProductStore = {
  filters: ProductFilters;
  setFilters: (filters: ProductFilters) => void;
  products: any[];
  setProducts: (products: any[]) => void;
  meta: { totalItems?: number };
  setMeta: (meta: any) => void;
};

export const useProductStore = create<ProductStore>((set) => ({
  filters: { page: 1, limit: 10 },
  setFilters: (filters) => set({ filters }),
  products: [],
  setProducts: (products) => set({ products }),
  meta: {},
  setMeta: (meta) => set({ meta }),
}));


