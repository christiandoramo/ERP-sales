// libs/product-service.lib/src/lib/presentation/dtos/index-products.dto.ts
// input
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ZodValidationPipe } from '@erp-product-coupon/pipe-config';

export const indexProductsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10), // começa com 10 e no 1 ^ ^ - não 0
  search: z.string().min(1).max(100).optional(),
  minPrice: z.coerce.number().min(0.01).optional(),
  maxPrice: z.coerce.number().max(1000000).optional(),
  hasDiscount: z.coerce.boolean().optional(),
  sortBy: z.enum(['name', 'price', 'createdAt' , 'stock']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  includeDeleted: z.coerce.boolean().optional(),
  onlyOutOfStock: z.coerce.boolean().optional(),
  withCouponApplied: z.coerce.boolean().optional(),
});

export class IndexProductsDto extends createZodDto(indexProductsSchema) {}

export const indexProductsValidationPipe = new ZodValidationPipe(indexProductsSchema);

// output /////////////////////////////////

export const discountSchema = z.object({
  type: z.enum(['percent', 'fixed']),
  value: z.number(),
  appliedAt: z.string(), // ou z.date().transform(d => d.toISOString())
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
  deletedAt: z.string().optional(),
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

export class IndexProductsOutputDto extends createZodDto(indexProductsOutputSchema) {}