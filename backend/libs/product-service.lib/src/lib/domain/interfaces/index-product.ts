//libs/coupon-service.lib/src/lib/domain/interfaces/index.coupon.input.ts
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
    appliedAt: Date;
  } | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface IndexProductsOutput {
  data: ProductListItemOutput[];
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
  sortBy?: 'name' | 'price' | 'createdAt' | 'stock';
  sortOrder?: 'asc' | 'desc';
  includeDeleted?: boolean;
  onlyOutOfStock?: boolean;
  withCouponApplied?: boolean;
}
