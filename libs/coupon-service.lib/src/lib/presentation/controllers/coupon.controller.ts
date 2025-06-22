import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { CreateCouponUseCase } from '../../application/use-cases/create-coupon.use-case'
import {
  CreateCouponDto,
  createCouponValidationPipe,
} from '../dtos/create-coupon.dto'
import {
  IndexCouponsDto,
  indexCouponsValidationPipe,
  indexCouponsSchema
} from '../dtos/index-coupon.dto';
import { IndexCouponsUseCase } from '../../application/use-cases/index-coupon.use-case';
import { wrapRpc } from '@erp-product-coupon/pipe-config';
import { IndexCouponsInput } from '../../domain/interfaces/index-coupon';


@Controller()
export class CouponController {
  constructor(
    private readonly createCouponUseCase: CreateCouponUseCase,
    private readonly indexCouponsUseCase: IndexCouponsUseCase
  ) {}

  @MessagePattern('coupon.create')
  async handleCreate(@Payload(createCouponValidationPipe) payload: CreateCouponDto) {
    return wrapRpc(async () => {
         return await this.createCouponUseCase.execute({
      code: payload.code,
      type: payload.type,
      value: payload.value,
      oneShot: payload.oneShot,
      maxUses: payload.maxUses,
      validFrom: payload.validFrom,
      validUntil: payload.validUntil,
    });
    })();
  }

  @MessagePattern('coupon.index')
  async handleIndex(
    @Payload(indexCouponsValidationPipe) payload: IndexCouponsDto
  ) {
    return wrapRpc(async () => {
          const parsed: IndexCouponsInput = indexCouponsSchema.parse(payload);
    return await this.indexCouponsUseCase.execute(parsed);
    })();
  }
}
