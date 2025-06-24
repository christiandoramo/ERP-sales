// libs/product-service.lib/src/lib/application/use-cases/index-products.use-case.ts
import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/product.repository';
import {
  IndexProductsOutput,
  IndexProductsInput,
} from '../../domain/interfaces/index-product';
import {
  UnprocessableEntityException,
} from '@erp-product-coupon/pipe-config';

// @Injectable()
// export class IndexProductsUseCase {
//   constructor(private readonly productRepository: ProductRepository) {}

//   async execute(
//     params: IndexProductsInput
//   ): Promise<IndexProductsOutput | null> {
//     if (
//       params?.maxPrice && params?.minPrice
//         ? params.minPrice > params.maxPrice
//         : false
//     )
//       throw new UnprocessableEntityException(
//         'Preço mínimo não pode ser maior que o preço máximo'
//       );
//       console.log("entrou em params: ",params)
//     return this.productRepository.indexProducts(params);
//   }
// }

@Injectable()
export class IndexProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(
    params: IndexProductsInput
  ): Promise<IndexProductsOutput> {
    const {
      page = 1,
      limit = 10,
    } = params;

    if (
      params?.maxPrice && params?.minPrice
        ? params.minPrice > params.maxPrice
        : false
    ) {
      throw new UnprocessableEntityException(
        'Preço mínimo não pode ser maior que o preço máximo'
      );
    }

    const products = await this.productRepository.indexProducts(params);

    const totalItems = products.length;
    const totalPages = Math.ceil(totalItems / limit);

    const data = products.map((product) => {
      const isOutOfStock = product.stock === 0;

      const discount = product.discount; // pode ser nulo
      const totalDiscountValue =
        discount != null
          ? discount.type === 'fixed' 
            ? discount.value
            : Math.round((product.price * discount.value) / 100)
          : 0;

      const finalPrice =
        discount != null
          ? Math.max(0, +(product.price - totalDiscountValue).toFixed(2))
          : product.price;

      const hasCouponApplied = discount?.type === 'fixed'; // se for falso queer dizer não existe desconto

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        stock: product.stock,
        isOutOfStock,
        price: product.price,
        finalPrice,
        hasCouponApplied,
        discount,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        deletedAt: product?.deletedAt || null,
      };
    });

    return {
      data,
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    };
  }
}
