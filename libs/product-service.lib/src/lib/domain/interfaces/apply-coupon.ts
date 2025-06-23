export interface ApplyCouponInput {
  productId: number;
  couponCode: string;
}

export interface ApplyCouponOutput {
  discount: number;
  finalPrice: number;
}