// libs/product-service.lib/src/lib/application/use-cases/index-products.use-case.ts
import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/product.repository';
import {
  IndexProductsOutput,
  IndexProductsInput,
} from '../../domain/interfaces/index.product';
import {
  UnprocessableEntityException,
} from '@erp-product-coupon/pipe-config';

@Injectable()
export class IndexProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(
    params: IndexProductsInput
  ): Promise<IndexProductsOutput | null> {
    if (
      params?.maxPrice && params?.minPrice
        ? params.minPrice > params.maxPrice
        : false
    )
      throw new UnprocessableEntityException(
        'Preço mínimo não pode ser maior que o preço máximo'
      );

    return this.productRepository.indexProducts(params);
  }
}
