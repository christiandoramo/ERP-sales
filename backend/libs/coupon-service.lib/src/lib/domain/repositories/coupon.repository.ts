// libs/coupon-service.lib/src/lib/domain/repositories/coupon.repository.ts

import { Coupon } from '../entities/coupon.entity';
import { IndexCouponsInput, IndexCouponsOutput } from '../interfaces/index-coupon';

export abstract class CouponRepository { // PRESENTATION NÃO FICA DENTRO DE DOMAIN - REMOVER DTOs, usar ENTITIES
  abstract createCoupon(coupon: Coupon): Promise<number | null>;

  abstract createMany(coupons: Coupon[]): Promise<number>;


  abstract showCoupon(id: number): Promise<Coupon | null>;

  abstract findByName(name: string): Promise<Coupon | null>;

  abstract indexCoupons(params: IndexCouponsInput): Promise<IndexCouponsOutput>;

}