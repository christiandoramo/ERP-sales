// libs/product-service.lib/src/lib/presentation/dtos/show-product.dto.ts
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ZodValidationPipe } from '@erp-product-coupon/pipe-config';
import { productItemSchema } from './index-product.dto';

export const showProductSchema = z.object({
  id: z.coerce.number().int().positive(), // pega o id da URL e transforma em número positivo
});

export class ShowProductDto extends createZodDto(showProductSchema) {}

export const showProductValidationPipe = new ZodValidationPipe(showProductSchema);


export const showProductOutputSchema = z.object({
  data: productItemSchema,
});

export class ShowProductOutputDto extends createZodDto(showProductOutputSchema) {}