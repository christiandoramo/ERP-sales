// libs/product-service.lib/src/lib/application/use-cases/create-product.use-case.ts

import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { CreateProductDto } from '../../presentation/dtos/create-product.dto';
import { Product } from '../../domain/entities/product.entity';

@Injectable()
export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(dto: CreateProductDto): Promise<number> {
    const {name,price,stock} = dto
    const description = dto?.description ?? null
    const product = Product.create({name,price,stock,description}); // factory com validações -Domínio do negócio preservado
    return await this.productRepository.createProduct(product);
  }
}
