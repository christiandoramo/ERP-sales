// libs/product-service.lib/src/lib/application/use-cases/show-product.use-case.ts
import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { ShowProductInput, ShowProductOutput } from '../../domain/interfaces/show-product.output';

@Injectable()
export class ShowProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(showProductInput: ShowProductInput): Promise<ShowProductOutput | null> {
    const product = await this.productRepository.getProductWithDiscount(showProductInput.id);
    if (!product) return null;

    const isOutOfStock = product.stock <= 0;

    const totalDiscountValue = product.discount
      ? product.discount.type === 'fixed'
        ? product.discount.value
        : Math.round((product.price * product.discount.value) / 100)
      : 0;

    const finalPrice =
      product?.discount !== null
        ? +(product.price - totalDiscountValue).toFixed(2)
        : product.price;

        // AVALIAR O FINAL PRICE não entra ao mérito desse use-case, a culpa é dos appply-coupon e apply-percent-discount
    // if (finalPrice !== null && finalPrice < 0.01) {
    //   throw new UnprocessableEntityException('Preço final inválido após aplicar cupom');
    // }

    return {
      data: {
        id: product.id,
        name: product.name,
        description: product.description,
        stock: product.stock,
        isOutOfStock,
        price: product.price,
        finalPrice,
        hasCouponApplied: !!product.discount && product.discount.type === 'fixed',
        discount: product.discount
          ? {
              type: product.discount.type,
              value: product.discount.value,
              appliedAt: product.discount.appliedAt,
            }
          : null,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        deletedAt: product?.deletedAt || null,
      },
    };
  }
}
