import { ConflictException, UnprocessableEntityException } from '@erp-product-coupon/pipe-config';
import { InMemoryProductRepository } from '../../../infrastructure/repositories/product.in-memo.repository';
import { ApplyPercentDiscountUseCase } from '../apply-percent-discount.use-case';

describe('ApplyPercentDiscountUseCase', () => {
  let repository: InMemoryProductRepository;
  let useCase: ApplyPercentDiscountUseCase;

  beforeEach(async () => {
    repository = new InMemoryProductRepository();
    useCase = new ApplyPercentDiscountUseCase(repository);

    await repository.createProduct({
      id: 1,
      name: 'Produto A',
      price: 100,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      description: 'Produto de teste',
    });
  });

  it('aplica 20% de desconto corretamente', async () => {
    const result = await useCase.execute({ productId: 1, percent: 20 });

    expect(result.finalPrice).toBe(80);
    expect(result.discount).toBe(20);
  });

  it('lança erro se o produto já tiver desconto aplicado', async () => {
    await useCase.execute({ productId: 1, percent: 10 });

    await expect(
      useCase.execute({ productId: 1, percent: 10 })
    ).rejects.toThrow(ConflictException);
  });

  it('lança erro se percentual for inválido (<1 ou >80)', async () => {
    await expect(
      useCase.execute({ productId: 1, percent: 0 })
    ).rejects.toThrow(UnprocessableEntityException);

    await expect(
      useCase.execute({ productId: 1, percent: 90 })
    ).rejects.toThrow(UnprocessableEntityException);
  });
});
