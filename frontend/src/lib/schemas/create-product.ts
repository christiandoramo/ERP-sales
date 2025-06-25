
import { z } from 'zod';
export const createProductSchema = z.object({
  name: z
    .string({ required_error: "Nome é obrigatório" }) // Mensagem para campo obrigatório
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres")
    .regex(/^[a-zA-Z0-9\s\-_,.]+$/, {
      message: 'Nome inválido (somente letras, números e alguns símbolos)',
    })
    .trim(),

  stock: z
    .number({ 
      required_error: "Estoque é obrigatório",
      invalid_type_error: 'Estoque deve ser um número' 
    })
    .int("O estoque deve ser um número inteiro") // Mensagem para inteiro
    .min(0, "Não pode ser negativo")
    .max(999999, "Estoque máximo permitido é 999.999"),

  price: z
    .number({ 
      required_error: "Preço é obrigatório",
      invalid_type_error: 'Preço inválido' 
    })
    .min(0.01, "O preço mínimo é R$ 0,01") // Mensagem para min
    .max(1000000, "O preço máximo é R$ 1.000.000"), // Mensagem para max

  description: z
    .string()
    .trim()
    .max(300, { message: 'Descrição deve ter no máximo 300 caracteres' })
    .optional()
    .nullable(),
});

export type CreateProductSchema = typeof createProductSchema;
export type CreateProductDto = z.infer<CreateProductSchema>;
