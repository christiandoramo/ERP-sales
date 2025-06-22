import { Injectable } from '@nestjs/common';
import { CouponRepository } from '../../domain/repositories/coupon.repository';
import { IndexCouponsInput, IndexCouponsOutput } from '../../domain/interfaces/index-coupon';
import { UnprocessableEntityException } from '@erp-product-coupon/pipe-config';

@Injectable()
export class IndexCouponsUseCase {
  constructor(private readonly couponRepository: CouponRepository) {}

  async execute(params: IndexCouponsInput): Promise<IndexCouponsOutput> {
    return this.couponRepository.indexCoupons(params);
  }
}