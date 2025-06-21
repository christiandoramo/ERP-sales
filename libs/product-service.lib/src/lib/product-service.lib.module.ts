//libs/product-service.lib/src/lib/product-service.lib.module.ts
import { Module } from '@nestjs/common';
import { HelloWorldUseCase } from './application/use-cases/helloworld.use-case';
// import { TransportModule } from './infrastructure/middleware/transport/transport.module';
import {EnvConfigModule} from '@erp-product-coupon/env-config'
import { PrismaModule} from '@erp-product-coupon/prisma-config'
import { HelloWorldController } from './presentation/controllers/helloword.controller';
import { ProductController } from './presentation/controllers/products.controller';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { ProductRepository } from './domain/repositories/product.repository';
import { DbProductRepository } from './infrastructure/repositories/product.db.repository';

@Module({
  imports: [EnvConfigModule.forRoot(), PrismaModule],
  controllers: [HelloWorldController, ProductController],
  providers: [HelloWorldUseCase, 
    {
      provide: ProductRepository,
      useClass: DbProductRepository,
    },
    CreateProductUseCase],
  exports: [HelloWorldUseCase,CreateProductUseCase],
})
export class ProductServiceLibModule {}
