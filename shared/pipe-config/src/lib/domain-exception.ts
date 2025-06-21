export abstract class DomainException extends Error {
  constructor(
    public override readonly message: string,
    public readonly statusCode: number, // ← Aqui já colocamos o status correto
  ) {
    super(message);
  }
}

//O código de status de resposta HTTP 400 Bad Request indica que o servidor não pode ou não irá processar a requisição devido a alguma coisa que foi entendida como um erro do cliente (por exemplo, sintaxe de requisição mal formada, enquadramento de mensagem de requisição inválida ou requisição de roteamento enganosa).
export class BadRequestException extends DomainException {
  constructor(message: string) {
    super(message, 400);
  }
}

// O status de resposta 409 Conflict indica que a solicitação atual conflitou com o recurso que está no servidor.
export class ConflictException extends DomainException {
  constructor(message: string) {
    super(message, 409);
  }
}

//A resposta de erro 404 Not Found indica que o servidor não conseguiu encontrar o recurso solicitado.
export class NotFoundException extends DomainException {
  constructor(message: string) {
    super(message, 404);
  }
}
//O codigo de resposta HTTP 422 Unprocessable Entity indica que o servidor entende o tipo de conteúdo da entidade da requisição, e a sintaxe da requisição esta correta, mas não foi possível processar as instruções presentes.
export class UnprocessableEntityException extends DomainException {
  constructor(message: string) {
    super(message, 422);
  }
}
