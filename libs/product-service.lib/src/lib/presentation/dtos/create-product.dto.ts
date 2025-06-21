// libs/product-service.lib/src/lib/presentation/dto/create-product.dto.ts
// { exemplo da requisição Post enviada pelo usuário para criar um produto (note que nem todos os dados precisam preencher)
//   "name": "Café Premium",
//   "description": "100% arábica",
//   "stock": 250,
//   "price": 2590
// } - vai ser validado com um pipe com ZodValidationPipe, createZodDto, zodToOpenAPI na pasta correta (clean-arch) e o objetivo principal é ser reutilizado no api-gateway, não quero ter que rescrever tudo de novo lá, ficaria inconsistente sem uma tipagem pronta...

import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ZodValidationPipe} from '@erp-product-coupon/pipe-config'

const createProductSchema = z.object({
  name: z.string().min(3).max(100).regex(/^[a-zA-Z0-9\s\-_,.]+$/),
  description: z.string().max(300).optional(),
  stock: z.number().int().min(0).max(999999),
  price: z
    .union([
      z.string().transform((val) => parseFloat(val.replace(',', '.'))),
      z.number()
    ])
    .refine((val) => val >= 0.01 && val <= 1000000, {
      message: 'Preço fora dos limites permitidos',
    }),
});

export const createProductValidationPipe = new ZodValidationPipe(
  createProductSchema
);

export class CreateProductDto extends createZodDto(createProductSchema) {}

export type CreateProductDtoType = z.infer<typeof createProductSchema>;
