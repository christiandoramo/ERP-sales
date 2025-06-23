import { UnprocessableEntityException } from '@erp-product-coupon/pipe-config';
import { Product } from './product.entity';
import { DiscountInterface } from '../interfaces/discount.interface';

export class ProductWithDiscount extends Product {
  public constructor(
    id: number,
    name: string,
    stock: number,
    price: number,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
    description: string | null,
    public discount: DiscountInterface | null
  ) {
    super(id, name, stock, price, createdAt, updatedAt, deletedAt, description);
    if (!!discount) {
      const totalDiscountValue =
        discount.type === 'fixed'
          ? discount.value
          : Math.round((price * discount.value) / 100);

      const finalPrice = +(price - totalDiscountValue).toFixed(2);
      if (finalPrice < 0.01)
        throw new UnprocessableEntityException(
          'Preço final inválido após aplicar cupom'
        );
    }
  }
}
