// shared/pipe-config/validation.pipe.ts
import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';
import { fromZodError } from 'zod-validation-error';

// Função para traduzir mensagens comuns
const translateError = (message: string): string => {
  const translations: Record<string, string> = {
    'Invalid input': 'Entrada inválida',
    'Invalid type': 'Tipo inválido',
    Required: 'Campo obrigatório',
    'Invalid email': 'Email inválido',
    'String must contain at least': 'Deve conter pelo menos',
    'Number must be greater than': 'Deve ser maior que',
    'Number must be less than': 'Deve ser menor que',
  };

  return Object.entries(translations).reduce(
    (msg, [en, pt]) => msg.replace(en, pt),
    message
  );
};

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        // Concatena e traduz os erros
        const concatenatedErrors = error.issues
          .map((issue) => {
            const path = issue.path.join('.');
            const translated = translateError(issue.message);
            return `${path} - ${translated}`;
          })
          .join('; ');

        throw new BadRequestException({
          message: `Erro de validação: ${concatenatedErrors}`,
          statusCode: 400,
          errors: fromZodError(error),
        });
      }

      throw new BadRequestException('Falha na validação');
    }
  }
}
