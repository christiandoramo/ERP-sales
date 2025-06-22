// apps/api-gateway/src/app/app.module.ts
import { Module } from '@nestjs/common';
import { HelloWorldController } from './presentation/controllers/hello.controller';
import { TransportModule } from './infrastructure/transport/transport.module';
import {EnvConfigModule } from '@erp-product-coupon/env-config';
import { ProductController } from './presentation/controllers/product.controller';
import { CouponController} from './presentation/controllers/coupon.controller'

@Module({
  imports: [EnvConfigModule.forRoot(), TransportModule],
  controllers: [HelloWorldController, ProductController, CouponController],
  providers: [],
})
export class AppModule {}
