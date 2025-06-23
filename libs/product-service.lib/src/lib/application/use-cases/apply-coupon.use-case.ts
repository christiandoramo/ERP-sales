import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/product.repository';
import {
  ApplyCouponInput,
  ApplyCouponOutput,
} from '../../domain/interfaces/apply-coupon';
import { CouponRepository } from 'libs/coupon-service.lib/src/lib/domain/repositories/coupon.repository';
import {
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from '@erp-product-coupon/pipe-config';
import { Coupon } from 'libs/coupon-service.lib/src/lib/domain/entities/coupon.entity';

@Injectable()
export class ApplyCouponUseCase {
  constructor(
    private readonly productRepo: ProductRepository,
    private readonly couponRepo: CouponRepository // esse serviço lida com validações e regras de cupom
  ) {}

  async execute(input: ApplyCouponInput): Promise<ApplyCouponOutput> {
    const repoCoupon = await this.couponRepo.findByName(input.couponCode);
    if (!repoCoupon) throw new NotFoundException('Cupom não encontrado');
    Coupon.validate(repoCoupon); // valida aqui critérios do cupom

        // verificar campo DESCONTO a partir daqui
    const productWithDiscount = await this.productRepo.getProductWithDiscount(
      input.productId
    );
    if (!productWithDiscount) throw new NotFoundException('Produto não encontrado');
    if (productWithDiscount?.discount){throw new ConflictException('Produto já possui um desconto aplicado');}
    // ja tem disconto e trás disconto - cupom (fixed/percent) ou percentual direto
    const discount =
      repoCoupon.type === 'fixed'
        ? repoCoupon.value
        : Math.round((productWithDiscount.price * repoCoupon.value) / 100);

    const finalPrice = +(productWithDiscount.price - discount).toFixed(2);
    if (finalPrice < 0.01)
      throw new UnprocessableEntityException(
        'Preço final inválido após aplicar cupom'
      );

    await this.productRepo.applyCouponToProduct({
      productId: input.productId,
      couponId: repoCoupon.id,
    });

    return {
      discount,
      finalPrice,
    };
  }
}
