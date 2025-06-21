import { CreateProductUseCase } from '../create-product.use-case';
import { InMemoryProductRepository } from '../../../infrastructure/repositories/product.in-memo.repository';
import {
  UnprocessableEntityException,
  ConflictException,
} from '@erp-product-coupon/pipe-config';

describe('CreateProductUseCase', () => {
  let repository: InMemoryProductRepository;
  let useCase: CreateProductUseCase;

  beforeEach(() => {
    repository = new InMemoryProductRepository();
    useCase = new CreateProductUseCase(repository);
  });

  describe('Criação válida', () => {
    it('deve retornar o id ao criar um produto válido', async () => {
      const productId = await useCase.execute({
        name: 'Produto Válido',
        price: 2590,
        stock: 100,
        description: 'Produto comum',
      });

      expect(productId).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Validações de domínio', () => {
    it('deve lançar erro se o estoque for menor que 0', async () => {
      await expect(
        useCase.execute({
          name: 'Produto Inválido',
          price: 100,
          stock: -1,
          description: 'Estoque inválido',
        }),
      ).rejects.toThrow(UnprocessableEntityException);
    });

    it('deve lançar erro se o estoque for maior que 999999', async () => {
      await expect(
        useCase.execute({
          name: 'Estoque Excessivo',
          price: 100,
          stock: 1_000_000,
          description: 'Estoque inválido',
        }),
      ).rejects.toThrow(UnprocessableEntityException);
    });

    it('deve lançar erro se o preço for menor que 0.01', async () => {
      await expect(
        useCase.execute({
          name: 'Produto Barato',
          price: 0.005,
          stock: 10,
          description: 'Preço inválido',
        }),
      ).rejects.toThrow(UnprocessableEntityException);
    });

    it('deve lançar erro se o preço for maior que 1 milhão', async () => {
      await expect(
        useCase.execute({
          name: 'Produto Caro',
          price: 1_000_001,
          stock: 10,
          description: 'Preço acima do permitido',
        }),
      ).rejects.toThrow(UnprocessableEntityException);
    });

    it('deve lançar erro se o nome tiver menos de 3 caracteres', async () => {
      await expect(
        useCase.execute({
          name: 'AB',
          price: 100,
          stock: 10,
          description: 'Nome muito curto',
        }),
      ).rejects.toThrow(UnprocessableEntityException);
    });

    it('deve lançar erro se o nome tiver mais de 100 caracteres', async () => {
      const longName = 'A'.repeat(101);
      await expect(
        useCase.execute({
          name: longName,
          price: 100,
          stock: 10,
          description: 'Nome muito longo',
        }),
      ).rejects.toThrow(UnprocessableEntityException);
    });
  });

  describe('Regra de unicidade de nome', () => {
    it('deve lançar erro ao tentar criar dois produtos com o mesmo nome', async () => {
      const produto = {
        name: 'Produto Repetido',
        price: 100,
        stock: 10,
        description: 'Primeiro produto',
      };

      await useCase.execute(produto);

      await expect(
        useCase.execute({
          ...produto,
          description: 'Tentativa duplicada',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });
});
