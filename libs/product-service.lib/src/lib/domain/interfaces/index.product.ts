// libs/product-service.lib/src/lib/domain/interfaces/index-products.output.ts
export interface ProductListItemOutput {
  id: number;
  name: string;
  description: string | null;
  stock: number;
  isOutOfStock: boolean;
  price: number;
  finalPrice: number;
  hasCouponApplied: boolean;
  discount?: {
    type: 'percent' | 'fixed';
    value: number;
    appliedAt: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface IndexProductsOutput {
  data: ProductListItemOutput[] | null;
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}


// libs/product-service.lib/src/lib/domain/interfaces/index-products.input.ts
export interface IndexProductsInput {
  page?: number;
  limit?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  hasDiscount?: boolean;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  includeDeleted?: boolean;
  onlyOutOfStock?: boolean;
  withCouponApplied?: boolean;
}
