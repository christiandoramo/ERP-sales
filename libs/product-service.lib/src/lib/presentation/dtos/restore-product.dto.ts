import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ZodValidationPipe } from '@erp-product-coupon/pipe-config';

export const restoreOutputSchema = z.object({
  message: z.string(),
  productId: z.number(),
})
export class RestoreOutputDto extends createZodDto(restoreOutputSchema) {}

export const restoreOutputOutputValidationPipe = new ZodValidationPipe(restoreOutputSchema);