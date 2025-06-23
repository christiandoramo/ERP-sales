import { InMemoryProductRepository } from '../../../infrastructure/repositories/product.in-memo.repository';
import { InMemoryCouponRepository } from '../../../../../../coupon-service.lib/src/lib/infrastructure/repositories/coupon.in-memo.repository';
import { ApplyCouponUseCase } from '../apply-coupon.use-case';
import { NotFoundException ,ConflictException} from '@erp-product-coupon/pipe-config';

describe('ApplyCouponUseCase', () => {
  let productRepo: InMemoryProductRepository;
  let couponRepo: InMemoryCouponRepository;
  let useCase: ApplyCouponUseCase;

  beforeEach(async () => {
    productRepo = new InMemoryProductRepository();
    couponRepo = new InMemoryCouponRepository();
    useCase = new ApplyCouponUseCase(productRepo, couponRepo);

    await productRepo.createProduct({
      id: 1,
      name: 'Produto B',
      price: 100,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      description: 'Produto com cupom',
    });
  });

  it('aplica cupom fixo corretamente', async () => {
    await couponRepo.createCoupon({
      id: 1,
      code: 'fixo-15',
      type: 'fixed',
      value: 15,
      oneShot: false,
      maxUses: 10,
      usesCount: 0,
      validFrom: new Date(Date.now() - 1000),
      validUntil: new Date(Date.now() + 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const result = await useCase.execute({ productId: 1, couponCode: 'fixo-15' });

    expect(result.finalPrice).toBe(85);
    expect(result.discount).toBe(15);
  });

  it('aplica cupom percentual corretamente', async () => {
    await couponRepo.createCoupon({
      id: 2,
      code: 'percent-20',
      type: 'percent',
      value: 20,
      oneShot: false,
      maxUses: 10,
      usesCount: 0,
      validFrom: new Date(Date.now() - 1000),
      validUntil: new Date(Date.now() + 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const result = await useCase.execute({ productId: 1, couponCode: 'percent-20' });

    expect(result.finalPrice).toBe(80);
    expect(result.discount).toBe(20);
  });

  it('lança erro se cupom não existir', async () => {
    await expect(
      useCase.execute({ productId: 1, couponCode: 'inexistente' })
    ).rejects.toThrow(NotFoundException);
  });

  it('lança erro se produto já tiver desconto', async () => {
    await couponRepo.createCoupon({
      id: 3,
      code: 'apenas-1x',
      type: 'fixed',
      value: 10,
      oneShot: false,
      maxUses: 10,
      usesCount: 0,
      validFrom: new Date(Date.now() - 1000),
      validUntil: new Date(Date.now() + 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    await useCase.execute({ productId: 1, couponCode: 'apenas-1x' });

    await expect(
      useCase.execute({ productId: 1, couponCode: 'apenas-1x' })
    ).rejects.toThrow(ConflictException);
  });
});
