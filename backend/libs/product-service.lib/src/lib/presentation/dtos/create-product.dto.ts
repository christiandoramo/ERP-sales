import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ZodValidationPipe } from '@erp-product-coupon/pipe-config';

export const createProductSchema = z.object({
  name: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-zA-Z0-9\s\-_,.]+$/).trim(),
  stock: z.number().int().min(0).max(999999),
  price: z
    .union([
      z.string().trim().transform((val) => parseFloat(val.replace(',', '.'))),
      z.number()
    ])
    .refine((val) => val >= 0.01 && val <= 1000000, {
      message: 'Preço fora dos limites permitidos',
    }),
  description: z.string().trim().max(300).optional().nullable().default(null),
});

export const createProductValidationPipe = new ZodValidationPipe(
  createProductSchema
);

export class CreateProductDto extends createZodDto(createProductSchema) {}

export const createProductOkResponseSchema = z.object({
  id: z.number().int().min(0),
});

export class CreateProductOkResponseDto extends createZodDto(
  createProductOkResponseSchema
) {}
