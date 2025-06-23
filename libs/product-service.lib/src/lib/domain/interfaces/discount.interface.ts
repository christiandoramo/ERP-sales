export interface DiscountInterface{
  type: 'fixed'|'percent'
  value: number
  appliedAt: Date
}

export interface ApplyCouponToProductInput {
  productId: number;
  couponId: number;
}

export interface ApplyDiscountInput {
  productId: number;
  discount: number;
}