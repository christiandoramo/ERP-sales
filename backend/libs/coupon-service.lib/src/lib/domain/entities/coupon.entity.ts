// libs/coupon-service.lib/src/lib/domain/entities/coupon.entity.ts
import { UnprocessableEntityException } from '@erp-product-coupon/pipe-config';
import { CreateCouponInput } from '../interfaces/create-coupon.input';

export class Coupon {
  private constructor(
    public readonly id: number,
    public readonly code: string,
    public readonly type: 'percent' | 'fixed',
    public readonly value: number,
    public readonly oneShot: boolean,
    public readonly maxUses: number,
    public readonly usesCount: number,
    public readonly validFrom: Date,
    public readonly validUntil: Date,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null
  ) {

    Coupon.validate({code,type,value,oneShot,maxUses,validFrom,validUntil})
  }

  public static validate(
    props: CreateCouponInput ): void {
    const { type, value, maxUses,validFrom, validUntil,code } = props;
    if (code.length <4 || code.length > 20) {
      throw new UnprocessableEntityException(
        'Código do cupom inválido. O nome do cupom deve estar entre 4 e 20'
      );
    }

    if (type !== 'percent' && type !== 'fixed') {
      throw new UnprocessableEntityException(
        'Tipo de cupom inválido. Esperado: "percent" ou "fixed".'
      );
    }

    if (type === 'percent' && (value < 1 || value > 80)) {
      throw new UnprocessableEntityException(
        'Cupom percentual deve ter valor entre 1% e 80%.'
      );
    }

    if (type === 'fixed' && value <= 0) {
      throw new UnprocessableEntityException(
        'Cupom fixo deve ter valor monetário positivo.'
      );
    }

    if (maxUses < 1) {
      throw new UnprocessableEntityException(
        'O número máximo de usos deve ser no mínimo 1.'
      );
    }

    if (validUntil <= validFrom) {
      throw new UnprocessableEntityException(
        'valid_until deve ser posterior a valid_from.'
      );
    }

    const maxValidUntil = new Date(validFrom);
    maxValidUntil.setFullYear(maxValidUntil.getFullYear() + 5);
    if (validUntil > maxValidUntil) {
      throw new UnprocessableEntityException(
        'valid_until não pode exceder 5 anos após valid_from.'
      );
    }
  }

  static create(
    props: CreateCouponInput): Coupon {
    this.validate(props);
    const now = new Date();

    return new Coupon(
      0,
      props.code.trim(), // code será validado e normalizado no use-case
      props.type,
      props.value,
      props.oneShot,
      props.maxUses,
      0,
      props.validFrom,
      props.validUntil,
      now,
      now,
      null
    );
  }

  static restore(props: Coupon): Coupon {
    this.validate({
      code: props.code,
      type: props.type,
      value: props.value,
      oneShot: props.oneShot,
      maxUses: props.maxUses,
      validFrom: props.validFrom,
      validUntil: props.validUntil,
    });

    return new Coupon(
      props.id,
      props.code,
      props.type,
      props.value,
      props.oneShot,
      props.maxUses,
      props.usesCount,
      props.validFrom,
      props.validUntil,
      props.createdAt,
      props.updatedAt,
      props.deletedAt
    );
  }
}
