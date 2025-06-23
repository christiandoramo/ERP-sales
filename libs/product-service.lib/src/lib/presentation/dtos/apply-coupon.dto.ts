// libs/product-service.lib/src/lib/presentation/dtos/apply-coupon.dto.ts
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ZodValidationPipe } from '@erp-product-coupon/pipe-config';

export const applyCouponSchema = z.object({
  productId: z.number().int().min(1),
  couponCode: z.string().min(4).max(20).trim(), // entre 4 e 20
});


export const applyCouponValidationPipe = new ZodValidationPipe(
  applyCouponSchema
);

export class ApplyCouponDto extends createZodDto(applyCouponSchema) {}


export const applyCouponResponseSchema = z.object({
  discount: z.number().min(0),
  finalPrice: z.number().min(0),
});

export class ApplyCouponResponseDto extends createZodDto(
  applyCouponResponseSchema
) {}


// http

export const applyCouponSchemaHttp = applyCouponSchema.omit({ productId: true })


export class ApplyCouponHttpDto extends createZodDto(applyCouponSchemaHttp) {}

export const applyCouponHttpValidationPipe = new ZodValidationPipe(
  applyCouponSchemaHttp
);