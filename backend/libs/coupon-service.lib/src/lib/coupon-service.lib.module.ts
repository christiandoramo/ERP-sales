import { Module } from '@nestjs/common';
import { EnvConfigModule } from '@erp-product-coupon/env-config';
import { PrismaModule } from '../../../../shared/prisma-config/src/index';
import { CouponRepository } from './domain/repositories/coupon.repository';
import { DbCouponRepository } from './infrastructure/repositories/coupon.db.repository';
import { CouponController } from './presentation/controllers/coupon.controller';
import { CreateCouponUseCase } from './application/use-cases/create-coupon.use-case';
import { IndexCouponsUseCase } from './application/use-cases/index-coupon.use-case';

@Module({
  imports: [EnvConfigModule.forRoot(), PrismaModule],
  controllers: [CouponController],
  providers: [
    {
      provide: CouponRepository,
      useClass: DbCouponRepository,
    },
    CreateCouponUseCase,
    IndexCouponsUseCase,
  ],
  exports: [
    CreateCouponUseCase,
    IndexCouponsUseCase,
    CouponRepository,
    {
      provide: CouponRepository,
      useClass: DbCouponRepository,
    },
  ],
})
export class CouponServiceLibModule {}
