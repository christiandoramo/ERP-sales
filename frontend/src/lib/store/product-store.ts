// src/lib/store/product-store.ts
import { create } from "zustand";
import { ProductItem, Meta } from "../schemas/index-products";

type ProductFilters = {
  page: number;
  limit: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  hasDiscount?: boolean;
  stock?: number;
  sortBy?: "name" | "price" | "createdAt" | "stock";
  sortOrder?: "asc" | "desc";
  includeDeleted?: boolean;
  onlyOutOfStock?: boolean;
  withCouponApplied?: boolean;
};

type ProductStore = {
  modalProductId: number | null;
  setModalProductId: (id: number | null) => void;
  selectedProduct: ProductItem | null;
  setSelectedProduct: (product: ProductItem | null) => void;
  filters: ProductFilters;
  forceUpdateKey: number;
  setFilters: (
    filters:
      | Partial<ProductFilters>
      | ((prev: ProductFilters) => ProductFilters)
  ) => void;
  products: ProductItem[];
  setProducts: (products: ProductItem[]) => void;

  meta: Meta;
  setMeta: (meta: Meta) => void;

  cache: Record<number, ProductItem[]>;
  setCache: (page: number, products: ProductItem[]) => void;
};

export const useProductStore = create<ProductStore>((set) => ({
  modalProductId: null,
  setModalProductId: (id) => set({ modalProductId: id }),
  selectedProduct: null,
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  filters: { page: 1, limit: 10 },
  forceUpdateKey: 0,

  setFilters: (filters) =>
    set((state) => {
      const newFilters =
        typeof filters === "function"
          ? filters(state.filters)
          : { ...state.filters, ...filters };

      return {
        filters: newFilters,
        forceUpdateKey: state.forceUpdateKey + 1,
      };
    }),

  products: [],
  setProducts: (products) => set({ products }),

  meta: {
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
  },
  setMeta: (meta) => set({ meta }),

  cache: {},
  setCache: (page, products) =>
    set((state) => ({
      cache: {
        ...state.cache,
        [page]: products,
      },
    })),
}));
