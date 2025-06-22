// libs/product-service.lib/src/lib/domain/repositories/product.repository.ts

import { Product } from '../../domain/entities/product.entity';
import { IndexProductsOutput} from '../interfaces/index.product';
import { IndexProductsInput } from '../interfaces/index.product';



export abstract class ProductRepository { // PRESENTATION NÃO FICA DENTRO DE DOMAIN - REMOVER DTOs, usar ENTITIES
  abstract createProduct(product: Product): Promise<number | null>;

  abstract createMany(products: Product[]): Promise<number>;


  abstract showProduct(id: number): Promise<Product | null>;

  abstract findByName(name: string): Promise<Product | null>;

  abstract indexProducts(params: IndexProductsInput): Promise<IndexProductsOutput>;

}