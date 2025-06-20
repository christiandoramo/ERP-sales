// apps/product-service/src/app/app.module.ts
import { Module } from '@nestjs/common';
import {ProductServiceLibModule} from '@erp-product-coupon/product-service.lib'
import {EnvConfigModule} from '@erp-product-coupon/env-config'
@Module({
  imports: [EnvConfigModule,ProductServiceLibModule],
})
export class AppModule {}