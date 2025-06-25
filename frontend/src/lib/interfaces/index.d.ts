// src/lib/interfaces/index.d.ts

//export declare global{
  export interface ProductFilters {
    page: number;
    limit: number;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    hasDiscount?: boolean;
    sortBy?: "name" | "price" | "createdAt";
    sortOrder?: "asc" | "desc";
    includeDeleted?: boolean;
    onlyOutOfStock?: boolean;
    withCouponApplied?: boolean;
  }

  export interface ProductState {
    filters: ProductFilters;
    products: ProductItem[];
    meta: Meta | null;

    setFilters: (filters: Partial<ProductFilters>) => void;
    setProducts: (products: ProductItem[]) => void;
    setMeta: (meta: Meta) => void;
    clear: () => void;
  }

  export interface LoadingState {
  loading: boolean;
  setLoading: (value: boolean) => void;
}

interface ProductForUpdate {
  id: number;
  name: string;
  description: string | null;
  stock: number;
  price: number;
  deletedAt: string | null;
}

interface Props {
  initialProduct: ProductForUpdate;
}