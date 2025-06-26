import { Injectable } from '@nestjs/common';

@Injectable()
export class HelloWorldUseCase {
  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}



// Use-case para apoio emocional