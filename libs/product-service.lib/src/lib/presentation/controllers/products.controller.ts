import { Controller } from '@nestjs/common';
import {
  MessagePattern,
  Payload,
  Ctx,
  RmqContext,
} from '@nestjs/microservices';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case';
import {
  CreateProductDto,
  createProductValidationPipe,
} from '../dtos/create-product.dto';
import {
  IndexProductsDto,
  indexProductsValidationPipe,
  indexProductsSchema,
} from '../dtos/index-product.dto';
import { IndexProductsUseCase } from '../../application/use-cases/index-product.use-case';
import { wrapRpc } from '@erp-product-coupon/pipe-config';
import { IndexProductsInput } from '../../domain/interfaces/index-product';
import {
  ApplyPercentDiscountDto,
  applyPercentDiscountValidationPipe,
} from '../dtos/apply-percent-discount.dto';
import {
  ApplyCouponDto,
  applyCouponValidationPipe,
} from '../dtos/apply-coupon.dto';
import { ApplyPercentDiscountUseCase } from '../../application/use-cases/apply-percent-discount.use-case';
import { ApplyCouponUseCase } from '../../application/use-cases/apply-coupon.use-case';
import { ApplyCouponInput } from '../../domain/interfaces/apply-coupon';
import { ApplyPercentDiscountInput } from '../../domain/interfaces/apply-percent-discount';

@Controller()
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly indexProductsUseCase: IndexProductsUseCase,
    private readonly applyCouponUseCase: ApplyCouponUseCase,
    private readonly applyPercentDiscountUseCase: ApplyPercentDiscountUseCase
  ) {}

  @MessagePattern('product.create')
  async handleCreate(
    @Payload(createProductValidationPipe) payload: CreateProductDto
  ) {
    return wrapRpc(async () => {
      const { name, price, stock } = payload;
      return await this.createProductUseCase.execute({
        description: payload?.description ?? null,
        name,
        price,
        stock,
      });
    })();
  }

  @MessagePattern('product.index')
  async handleIndex(
    @Payload(indexProductsValidationPipe) payload: IndexProductsDto
  ) {
    return wrapRpc(async () => {
      const parsed: IndexProductsInput = indexProductsSchema.parse(payload);
      return await this.indexProductsUseCase.execute(parsed);
    })();
  }

  @MessagePattern('product.apply-coupon')
  async handleApplyCoupon(
    @Payload(applyCouponValidationPipe) payload: ApplyCouponDto
  ) {
        console.log("aqui: 2")

    const { couponCode, productId } = payload;
    return wrapRpc(() =>
      this.applyCouponUseCase.execute({
        couponCode,
        productId,
      })
    )();
  }

  @MessagePattern('product.apply-percent-discount')
  async handleApplyPercentDiscount(
    @Payload(applyPercentDiscountValidationPipe)
    payload: ApplyPercentDiscountDto
  ) {
    const { percent, productId } = payload;
    return wrapRpc(() =>
      this.applyPercentDiscountUseCase.execute({
        percent,
        productId,
      })
    )();
  }
}
