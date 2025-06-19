import { Controller } from '@nestjs/common';
import { MessagePattern,Payload } from '@nestjs/microservices';
import { HelloWorldUseCase } from 'libs/product-service.application/src/lib/use-cases/helloworld.use-case';

@Controller()
export class HelloWorldController {
  constructor(
    private readonly helloWorldUserCase: HelloWorldUseCase
  ) {}

  @MessagePattern('hello.world')
  getData() {
    return this.helloWorldUserCase.getData();
  }
}