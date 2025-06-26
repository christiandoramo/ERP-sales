import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ZodValidationPipe } from '@erp-product-coupon/pipe-config';

export const softDeleteOutputSchema = z.object({
  message: z.string(),
  productId: z.number(),
})
export class SoftDeleteOutputDto extends createZodDto(softDeleteOutputSchema) {}

export const softDeleteOutputValidationPipe = new ZodValidationPipe(softDeleteOutputSchema);