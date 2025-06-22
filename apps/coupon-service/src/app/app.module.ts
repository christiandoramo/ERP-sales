// // apps/coupon-service/src/app/app.module.ts
import { Module } from '@nestjs/common';
import {CouponServiceLibModule} from '@erp-product-coupon/coupon-service.lib'
import {EnvConfigModule} from '@erp-product-coupon/env-config'
@Module({
  imports: [EnvConfigModule,CouponServiceLibModule],
})
export class AppModule {}