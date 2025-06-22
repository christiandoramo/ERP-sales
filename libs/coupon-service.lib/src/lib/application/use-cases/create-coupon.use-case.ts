// libs/coupon-service.lib/src/lib/application/use-cases/create-coupon.use-case.ts

import { Injectable } from '@nestjs/common';
import { CouponRepository } from '../../domain/repositories/coupon.repository';
import { Coupon } from '../../domain/entities/coupon.entity';
import { CreateCouponInput } from '../../domain/interfaces/create-coupon.input';
import { ConflictException } from '@erp-product-coupon/pipe-config';

@Injectable()
export class CreateCouponUseCase {
  constructor(private readonly couponRepository: CouponRepository) {}

  async execute(input: CreateCouponInput): Promise<number | null> {
    const existing = await this.couponRepository.findByName(input.code.trim());
    if (existing) {
      throw new ConflictException('Já existe um cupom com esse código');
    }

    const coupon = Coupon.create(input);
    return await this.couponRepository.createCoupon(coupon);
  }
}