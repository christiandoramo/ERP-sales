import { CreateCouponUseCase } from '../create-coupon.use-case';
import { InMemoryCouponRepository } from '../../../infrastructure/repositories/coupon.in-memo.repository';
import {
  ConflictException,
  UnprocessableEntityException,
} from '@erp-product-coupon/pipe-config';

describe('CreateCouponUseCase', () => {
  let repository: InMemoryCouponRepository;
  let sut: CreateCouponUseCase;

  beforeEach(() => {
    repository = new InMemoryCouponRepository();
    sut = new CreateCouponUseCase(repository);
  });

  it('deve criar cupom válido', async () => {
    const id = await sut.execute({
      code: 'WELCOME10',
      type: 'percent',
      value: 10,
      oneShot: false,
      maxUses: 5,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });

    expect(id).toBeGreaterThan(0);
  });

  it('deve lançar erro se código já existir', async () => {
    const input = {
      code: 'REPETIDO',
      type: 'fixed' as 'fixed'|'percent',
      value: 500,
      oneShot: true,
      maxUses: 10,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
    };

    await sut.execute(input);

    await expect(sut.execute(input)).rejects.toThrow(ConflictException);
  });

  it('deve lançar erro para cupom percentual > 80', async () => {
    await expect(
      sut.execute({
        code: 'MUITODESCONTO',
        type: 'percent',
        value: 90,
        oneShot: false,
        maxUses: 5,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
      }),
    ).rejects.toThrow(UnprocessableEntityException);
  });

  it('deve lançar erro se validUntil for anterior a validFrom', async () => {
    const now = new Date();
    const past = new Date(now.getTime() - 1000 * 60);

    await expect(
      sut.execute({
        code: 'DATASERRADAS',
        type: 'fixed',
        value: 100,
        oneShot: true,
        maxUses: 1,
        validFrom: now,
        validUntil: past,
      }),
    ).rejects.toThrow(UnprocessableEntityException);
  });
});
