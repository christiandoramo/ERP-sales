import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/product.repository';
import {
  ApplyPercentDiscountInput,
  ApplyPercentDiscountOutput,
} from '../../domain/interfaces/apply-percent-discount';
import {
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from '@erp-product-coupon/pipe-config';

@Injectable()
export class ApplyPercentDiscountUseCase {
  constructor(private readonly productRepo: ProductRepository) {}

  async execute(
    input: ApplyPercentDiscountInput
  ): Promise<ApplyPercentDiscountOutput> { 
    const product = await this.productRepo.showProduct(input.productId); // primeiro busca se existe produto
    if (!product) throw new NotFoundException('Produto não encontrado');

    if (input.percent < 1 || input.percent > 80) {
      // tanto cupom 'percent' quanto percentual direto tem essa regra
      throw new UnprocessableEntityException(
        'Percentual de desconto deve estar entre 1 e 80'
      );
    }
    const productWithDiscount = await this.productRepo.getProductWithDiscount(
      input.productId
    );
    if (!!productWithDiscount?.discount)
      throw new ConflictException('Produto já possui um desconto aplicado');
    // ja tem disconto e trás disconto - cupom (fixed/percent) ou percentual direto

    const discount = input.percent; //Math.round((product.price * input.percent) / 100);
    const finalPrice = +(product.price - discount * product.price).toFixed(2);

    if (finalPrice < 0.01) {
      throw new UnprocessableEntityException(
        'Preço final inválido após desconto'
      );
    }

    await this.productRepo.applyDiscount({
      productId: input.productId,
      discount,
    });
    return {
      discount,
      finalPrice,
    };
  }
}
