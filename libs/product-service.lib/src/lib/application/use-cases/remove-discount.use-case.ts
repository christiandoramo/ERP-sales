import {
  BadRequestException,
  NotFoundException,
  PreConditionException,
} from '@erp-product-coupon/pipe-config';
import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { RestoreOutput } from '../../domain/interfaces/restore.interface';

@Injectable()
export class RemoveProductDiscountUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(productId: number): Promise<RestoreOutput> {
    const product =
      await this.productRepository.findProductWithPercentsAndCoupons(productId);
    if (!product) throw new NotFoundException('Produto não encontrado');
    if (!product?.discount)
      throw new PreConditionException('Produto não possui desconto ativo');
    if (!!product.couponApplicationId) {
      console.log('product.couponApplicationId: ', product.couponApplicationId);
      await this.productRepository.removeCouponApplication({
        productId: product.id,
        couponApplicationId: product.couponApplicationId,
      });
      return {
        message: 'Desconto com cupom removido com sucesso',
        productId: product.id,
      };
    } else if (!!product.percentDiscountId) {
      console.log('product.percentDiscountId: ', product.percentDiscountId);
      await this.productRepository.removePercentDiscount({
        productId: product.id,
        percentDiscountId: product.percentDiscountId,
      });

      return {
        message: 'Desconto percentual removido com sucesso',
        productId: product.id,
      };
    } else {
      throw new BadRequestException(
        'Não foi encontrado nenhum registro de desconto'
      );
    }
  }
}
