export interface ApplyPercentDiscountInput {
  productId: number;
  percent: number;
}

export interface ApplyPercentDiscountOutput {
  discount: number;
  finalPrice: number;
}