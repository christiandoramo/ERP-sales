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
import { CouponServiceLibModule } from '@erp-product-coupon/coupon-service.lib';
import { ApplyCouponUseCase } from './application/use-cases/apply-coupon.use-case';
import { ApplyPercentDiscountUseCase } from './application/use-cases/apply-percent-discount.use-case';
import { ShowProductUseCase } from './application/use-cases/show-product.use-case';
import { RestoreProductUseCase } from './application/use-cases/restore-product.use-case';
import { SoftDeleteProductUseCase } from './application/use-cases/soft-delete.use-case';
import { RemoveProductDiscountUseCase } from './application/use-cases/remove-discount.use-case';
import { UpdateProductUseCase } from './application/use-cases/update-product.use-case';

@Module({
  imports: [EnvConfigModule.forRoot(), PrismaModule, CouponServiceLibModule],
  controllers: [HelloWorldController, ProductController],
  providers: [
    HelloWorldUseCase,
    {
      provide: ProductRepository,
      useClass: DbProductRepository,
    },
    CreateProductUseCase,
    IndexProductsUseCase,
    ApplyCouponUseCase,
    ApplyPercentDiscountUseCase,
    ShowProductUseCase,
    RestoreProductUseCase,
    SoftDeleteProductUseCase,
    RemoveProductDiscountUseCase,
    UpdateProductUseCase,
  ],
  exports: [
    HelloWorldUseCase,
    CreateProductUseCase,
    ApplyCouponUseCase,
    ApplyPercentDiscountUseCase,
    ShowProductUseCase,
    RestoreProductUseCase,
    SoftDeleteProductUseCase,
    RemoveProductDiscountUseCase,
    UpdateProductUseCase,
  ],
})
export class ProductServiceLibModule {}
