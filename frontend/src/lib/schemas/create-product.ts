// src/lib/schemas/create-product.ts
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-zA-Z0-9\s\-_,.]+$/)
    .trim(),
  stock: z
    .number({ invalid_type_error: 'Estoque deve ser um número' })
    .int()
    .min(0)
    .max(999999),
  price: z
    .union([
              z.number(),
      z.string().trim().transform((val) => parseFloat(val.replace(',', '.'))),
    ])
    .refine((val) => val >= 0.01 && val <= 1000000, {
      message: 'Preço fora dos limites permitidos',
    }),
  description: z
    .string()
    .trim()
    .max(300)
    .optional()
    .nullable()
    .default(null),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
