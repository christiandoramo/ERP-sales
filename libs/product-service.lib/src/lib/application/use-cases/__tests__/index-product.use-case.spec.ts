// libs/product-service.lib/src/lib/application/use-cases/__tests__/index-product.use-case.spec.ts

import { InMemoryProductRepository } from '../../../infrastructure/repositories/product.in-memo.repository';
import { IndexProductsUseCase } from '../../../application/use-cases/index-product.use-case';
import { Product } from '../../../domain/entities/product.entity';

describe('IndexProductUseCase', () => {
  let repository: InMemoryProductRepository;
  let useCase: IndexProductsUseCase;

  beforeEach(async () => {
    repository = new InMemoryProductRepository();
    useCase = new IndexProductsUseCase(repository);

    const fakeProducts: Product[] = Array.from({ length: 25 }).map((_, i) =>
      Product.restore({
        id: i + 1,
        name: `Produto ${i + 1}`,
        stock: Math.floor(Math.random() * 100),
        price: 100 + i,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        description: `Descrição do produto ${i + 1}`,
      }),
    );

    await repository.createMany(fakeProducts);
  });

  it('deve retornar até 20 produtos se houver 25 no total', async () => {
    const response = await useCase.execute({ page: 1, limit: 20 });

    expect(response).not.toBeNull();
    expect(response?.data?.length).toBe(20);
    expect(response?.meta.totalItems).toBe(25);
    expect(response?.meta.totalPages).toBe(2);
  });

  it('deve retornar os 5 produtos restantes na página 2', async () => {
    const response = await useCase.execute({ page: 2, limit: 20 });

    expect(response).not.toBeNull();
    expect(response?.data?.length).toBe(5);
  });
});
