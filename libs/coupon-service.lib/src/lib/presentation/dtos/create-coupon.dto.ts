import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ZodValidationPipe } from '@erp-product-coupon/pipe-config';

export const createCouponSchema = z.object({
  code: z
    .string()
    .trim()
    .min(4, 'O código deve ter no mínimo 4 caracteres')
    .max(20, 'O código deve ter no máximo 20 caracteres')
    .regex(/^[a-zA-Z0-9]+$/, 'O código deve conter apenas letras e números'),

  type: z.enum(['percent', 'fixed'], {
    errorMap: () => ({ message: 'Tipo inválido: use "percent" ou "fixed"' }),
  }),

  value: z
    .number({ invalid_type_error: 'Valor deve ser um número válido' })
    .refine((val) => val > 0, {
      message: 'Valor deve ser maior que 0',
    }),

  oneShot: z.boolean(),

  maxUses: z.number().int().min(1, 'Uso máximo deve ser no mínimo 1'),

  validFrom: z
    .string()
    .datetime('Data inválida')
    .transform((str) => new Date(str)),

  validUntil: z
    .string()
    .datetime('Data inválida')
    .transform((str) => new Date(str)),
})
.superRefine((data, ctx) => {
  if (data.type === 'percent' && (data.value < 1 || data.value > 80)) {
    ctx.addIssue({
      path: ['value'],
      code: z.ZodIssueCode.custom,
      message: 'Para cupons percentuais, o valor deve estar entre 1 e 80.',
    });
  }

  if (data.type === 'fixed' && data.value <= 0) {
    ctx.addIssue({
      path: ['value'],
      code: z.ZodIssueCode.custom,
      message: 'Para cupons fixos, o valor deve ser positivo.',
    });
  }

  if (data.validUntil <= data.validFrom) {
    ctx.addIssue({
      path: ['validUntil'],
      code: z.ZodIssueCode.custom,
      message: '`validUntil` deve ser posterior a `validFrom`.',
    });
  }

  const maxValidUntil = new Date(data.validFrom);
  maxValidUntil.setFullYear(maxValidUntil.getFullYear() + 5);
  if (data.validUntil > maxValidUntil) {
    ctx.addIssue({
      path: ['validUntil'],
      code: z.ZodIssueCode.custom,
      message: 'Validade máxima de um cupom é de 5 anos.',
    });
  }
});

export class CreateCouponDto extends createZodDto(createCouponSchema) {}
export const createCouponValidationPipe = new ZodValidationPipe(createCouponSchema);

export const createCouponOkResponseSchema = z.object({
  id: z.number().int().min(1),
});
export class CreateCouponOkResponseDto extends createZodDto(createCouponOkResponseSchema) {}
