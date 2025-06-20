//libs/product-service.lib/src/lib/product-service.lib.module.ts
import { Module } from '@nestjs/common';
import { HelloWorldUseCase } from './application/use-cases/helloworld.use-case';
// import { TransportModule } from './infrastructure/middleware/transport/transport.module';
import {EnvConfigModule} from '@erp-product-coupon/env-config'
import { PrismaModule} from '@erp-product-coupon/prisma-config'
import { HelloWorldController } from './presentation/controllers/helloword.controller';

@Module({
  imports: [EnvConfigModule.forRoot(),PrismaModule],
  controllers: [HelloWorldController],
  providers: [HelloWorldUseCase],
  exports: [HelloWorldUseCase],
})
export class ProductServiceLibModule {}
