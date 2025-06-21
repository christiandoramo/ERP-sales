import { CreateProductUseCase } from '../create-product.use-case';
import { InMemoryProductRepository } from '../../../infrastructure/repositories/product.in-memo.repository';

describe('CreateProductUseCase', () => {
  it('deve criar um produto válido', async () => {
    const repository = new InMemoryProductRepository();
    const useCase = new CreateProductUseCase(repository);

    const productId = await useCase.execute({
      name: 'Produto Teste',
      price: 2590,
      stock: 100,
      description: 'Produto fictício de teste',
    });

    const product = await repository.showProduct(productId)

    expect(product).toBeDefined();
    expect(product?.name).toBe('Produto Teste');
  });

  it('deve lançar erro se o estoque for inválido', async () => {
    const repository = new InMemoryProductRepository();
    const useCase = new CreateProductUseCase(repository);

    await expect(
      useCase.execute({
        name: 'Produto Inválido',
        price: 2590,
        stock: -10, // inválido - deve ser maior que 0 e menor ou igual a 999.999
        description: 'Erro esperado',
      }),
    ).rejects.toThrow('Invalid stock: -10');
  });

  it('deve lançar erro se o preço for menor que 0.01', async () => {
    const repository = new InMemoryProductRepository();
    const useCase = new CreateProductUseCase(repository);

    await expect(
      useCase.execute({
        name: 'Produto Barato',
        price: 0.005, // inválido
        stock: 10,
        description: 'Erro de preço',
      }),
    ).rejects.toThrow('Invalid price: 0.005');
  });
});
