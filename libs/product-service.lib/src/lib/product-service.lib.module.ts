//libs/product-service.lib/src/lib/product-service.lib.module.ts
import { Module } from '@nestjs/common';
import { HelloWorldUseCase } from './application/use-cases/helloworld.use-case';
// import { TransportModule } from './infrastructure/middleware/transport/transport.module';
import { EnvConfigModule } from '@erp-product-coupon/env-config';
import { PrismaModule } from '../../../../shared/prisma-config/src/index';
import { HelloWorldController } from './presentation/controllers/helloword.controller';
import { ProductController } from './presentation/controllers/products.controller';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { ProductRepository } from './domain/repositories/product.repository';
import { DbProductRepository } from './infrastructure/repositories/product.db.repository';
import { IndexProductsUseCase } from './application/use-cases/index-product.use-case';

@Module({
  imports: [EnvConfigModule.forRoot(), PrismaModule],
  controllers: [HelloWorldController, ProductController],
  providers: [
    HelloWorldUseCase,
    {
      provide: ProductRepository,
      useClass: DbProductRepository,
    },
    CreateProductUseCase,
    IndexProductsUseCase,
  ],
  exports: [HelloWorldUseCase, CreateProductUseCase],
})
export class ProductServiceLibModule {}
