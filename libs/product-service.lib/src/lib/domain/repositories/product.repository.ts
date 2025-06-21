// libs/product-service.lib/src/lib/domain/repositories/product.repository.ts

import { Product } from '../../domain/entities/product.entity';

export abstract class ProductRepository { // PRESENTATION NÃO FICA DENTRO DE DOMAIN - REMOVER DTOs, usar ENTITIES
  abstract createProduct(product: Product): Promise<number | null>;

  abstract showProduct(id: number): Promise<Product | null>;

  abstract findByName(name: string): Promise<Product | null>;
  // abstract findById(id: string): Promise<Product | null>;
  // abstract findByName(name: string): Promise<Product | null>;
}