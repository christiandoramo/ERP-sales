//libs/coupon-service.lib/src/lib/domain/interfaces/create-coupon.input.ts
export interface CreateCouponInput {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  oneShot: boolean;
  maxUses: number;
  validFrom: Date;
  validUntil: Date;
}
