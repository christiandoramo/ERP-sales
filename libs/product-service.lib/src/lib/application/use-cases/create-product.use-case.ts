// libs/product-service.lib/src/lib/application/use-cases/create-product.use-case.ts

import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';
import { CreateProductInput } from '../../domain/interfaces/create-product.input';
import { ConflictException, toRpc } from '@erp-product-coupon/pipe-config';

@Injectable()
export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(dto: CreateProductInput): Promise<number | null> {
    // aqui aplica a regra do domínio - camadas acima chamam camadas abaixo, não o contrário
    // ex: o use-case que chama o repository, não o contrário
    const existing = await this.productRepository.findByName(dto.name);
    if (existing) {
      toRpc(new ConflictException('Já existe um produto com esse nome'));
      //ConflictException('Já existe um produto com esse nome');// use-case valida regra fora da entidade (testa "tudo")
    }

    const product = Product.create(dto); // valida lógica pura da entidade produto
    return await this.productRepository.createProduct(product); // factory com validações -Domínio do negócio preservado
  }
}
