// libs/coupon-service.lib/src/lib/application/use-cases/__tests__/index-coupons.use-case.spec.ts
import { InMemoryCouponRepository } from '../../../infrastructure/repositories/coupon.in-memo.repository';
import { IndexCouponsUseCase} from './../index-coupon.use-case'
import { Coupon } from '../../../domain/entities/coupon.entity';

describe('IndexCouponsUseCase', () => {
  let repository: InMemoryCouponRepository;
  let useCase: IndexCouponsUseCase;

  beforeEach(async () => {
    repository = new InMemoryCouponRepository();
    useCase = new IndexCouponsUseCase(repository);

    const coupons = Array.from({ length: 25 }, (_, i) =>
      Coupon.restore({
        id: i + 1,
        code: `CUPOM${i + 1}`,
        type: 'fixed',
        value: 100 + i,
        oneShot: false,
        maxUses: 10,
        usesCount: 0,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      })
    );

    await repository.createMany(coupons);
  });

  it('deve retornar 20 cupons se houver 25', async () => {
    const result = await useCase.execute({ page: 1, limit: 20 });
    expect(result.data.length).toBe(20);
    expect(result.meta.totalItems).toBe(25);
    expect(result.meta.totalPages).toBe(2);
  });

  it('deve retornar os 5 cupons restantes na página 2', async () => {
    const result = await useCase.execute({ page: 2, limit: 20 });
    expect(result.data.length).toBe(5);
  });
});
