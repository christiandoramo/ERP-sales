// libs/coupon-service.lib/src/lib/presentation/dtos/index-coupons.dto.ts
// input
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ZodValidationPipe } from '@erp-product-coupon/pipe-config';

export const indexCouponsSchema = z.object({ // input dos dados
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  includeDeleted: z.coerce.boolean().optional(),
});

export class IndexCouponsDto extends createZodDto(indexCouponsSchema) {}
export const indexCouponsValidationPipe = new ZodValidationPipe(indexCouponsSchema);


export const couponItemSchema = z.object({ // parte da output/retorno dos dados
  id: z.number(),
  code: z.string(),
  type: z.enum(['percent', 'fixed']),
  value: z.number(),
  oneShot: z.boolean(),
  maxUses: z.number(),
  usesCount: z.number(),
  validFrom: z.string(),
  validUntil: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
});

export const metaSchema = z.object({ // parte da output/retorno dos dados
  page: z.number(),
  limit: z.number(),
  totalItems: z.number(),
  totalPages: z.number(),
});

// output

export const indexCouponsOutputSchema = z.object({ 
  data: z.array(couponItemSchema),
  meta: metaSchema,
});

export class IndexCouponsOutputDto extends createZodDto(indexCouponsOutputSchema) {}
