import { Module } from '@nestjs/common';
import { HelloWorldUseCase } from './use-cases/helloworld.use-case';
@Module({
  controllers: [],
  providers: [HelloWorldUseCase],
  exports: [HelloWorldUseCase],
})
export class ProductServiceApplicationModule {}
