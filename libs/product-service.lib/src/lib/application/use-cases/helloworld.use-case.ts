import { Injectable } from '@nestjs/common';

@Injectable()
export class HelloWorldUseCase {
  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
