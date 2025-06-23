// libs/product-service.lib/src/lib/presentation/dtos/apply-percent-discount.dto.ts
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ZodValidationPipe } from '@erp-product-coupon/pipe-config';

export const applyPercentDiscountSchema = z.object({
  productId: z.number().int().min(1),
  percent: z.number().min(1).max(80),
});

export const applyPercentDiscountValidationPipe = new ZodValidationPipe(
  applyPercentDiscountSchema
);

export class ApplyPercentDiscountDto extends createZodDto(
  applyPercentDiscountSchema
) {}

export const applyPercentDiscountResponseSchema = z.object({
  discount: z.number().min(0),
  finalPrice: z.number().min(0),
});

export class ApplyPercentDiscountResponseDto extends createZodDto(
  applyPercentDiscountResponseSchema
) {}


// http

export const applyPercentDiscountSchemaHttp = applyPercentDiscountSchema.omit({ productId: true })


export class ApplyPercentDiscountHttpDto extends createZodDto(applyPercentDiscountSchemaHttp) {}

export const applyPercentDiscountHttpValidationPipe = new ZodValidationPipe(
  applyPercentDiscountSchemaHttp
);