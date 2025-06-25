// src/lib/schemas/index-products.ts
import { z } from 'zod';

// INPUT
export const indexProductsSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(50).optional().default(10),
  search: z.string().min(1).max(100).optional(),
  minPrice: z.coerce.number().min(0.01).optional(), // falta impedir minPrice ser maior que maxPrice
  maxPrice: z.coerce.number().max(1000000).optional(),
  hasDiscount: z.coerce.boolean().optional(),
  sortBy: z.enum(['name', 'price','createdAt','stock']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  includeDeleted: z.coerce.boolean().optional(),
  onlyOutOfStock: z.coerce.boolean().optional(),
  withCouponApplied: z.coerce.boolean().optional(),
});


// OUTPUT
export const discountSchema = z.object({
  type: z.enum(['percent', 'fixed']),
  value: z.number(),
  appliedAt: z.string(),
});

export const productItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  stock: z.number(),
  isOutOfStock: z.boolean(),
  price: z.number(),
  finalPrice: z.number().nullable(),
  discount: discountSchema.nullable(),
  hasCouponApplied: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string(),
});

export const metaSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalItems: z.number(),
  totalPages: z.number(),
});



export const indexProductsOutputSchema = z.object({
  data: z.array(productItemSchema),
  meta: metaSchema,
});

// tipos
export type ProductItem = z.infer<typeof productItemSchema>;
export type Meta = z.infer<typeof metaSchema>;
export type IndexProductsOutput = z.infer<typeof indexProductsOutputSchema>;
export type ProductFilters = z.infer<typeof indexProductsSchema>;
