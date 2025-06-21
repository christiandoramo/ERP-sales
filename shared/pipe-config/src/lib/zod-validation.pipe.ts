// shared/pipe-config/validation.pipe.ts
import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';
import { fromZodError } from 'zod-validation-error';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Erro 400: O formato da requisição é inválido',
          statusCode: 400,
          errors: fromZodError(error),
        });
      }

      throw new BadRequestException('Falha na validação');
    }
  }
}