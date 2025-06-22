// apps/api-gateway/src/app/presentation/controllers/hello.controller.ts

import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('hello')
export class HelloWorldController {
  constructor(@Inject('PRODUCT_SERVICE') private readonly client: ClientProxy) {}

  @Get('/world')
  async getHellowWorld(): Promise<any> {
    try {
      const result = await firstValueFrom(this.client.send('hello.world', {}));
      return result;
    } catch (err) {
      console.error('Erro ao enviar hello.world', err);
      throw err;
    }
  }
}
