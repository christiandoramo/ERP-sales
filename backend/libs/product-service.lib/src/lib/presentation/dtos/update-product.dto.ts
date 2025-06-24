// [
//   { "op": "replace", "path": "/stock", "value": 300 },
//   { "op": "replace", "path": "/price", "value": 2790 }
// ]

import { z } from 'zod';
import { createZodDto, ZodValidationPipe } from 'nestjs-zod';

export const updateProductPatchSchema = z.array(
  z.object({
    op: z.literal('replace'),
    path: z.enum(['/name', '/description', '/stock', '/price', '/isActive']),
    value: z.union([z.string(), z.number(), z.boolean()]),
  })
);

export class UpdateProductPatchDto extends createZodDto(updateProductPatchSchema) {}


export const productItemUPatchOutputSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  stock: z.number(),
  price: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().optional(),
});
export class UpdateProductOutputPatchDto extends createZodDto(productItemUPatchOutputSchema) {}