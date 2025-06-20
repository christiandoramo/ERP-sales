//libs/product-service/src/lib/presentation/controllers/helloword.controller.ts

import { Controller } from '@nestjs/common';
import { MessagePattern,Payload } from '@nestjs/microservices';
import { HelloWorldUseCase } from '../../application/use-cases/helloworld.use-case';

@Controller()
export class HelloWorldController {
  constructor(
    private readonly helloWorldUserCase: HelloWorldUseCase
  ) {}

  @MessagePattern('hello.world')
  getData(@Payload() data: any) {
    console.log("chegooou")
    return this.helloWorldUserCase.getData();
  }
}