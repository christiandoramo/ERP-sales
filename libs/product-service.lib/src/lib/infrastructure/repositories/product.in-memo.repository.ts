import { ProductRepository } from '../../domain/repositories/product.repository'
import { Product} from '../../domain/entities/product.entity'

export class InMemoryProductRepository implements ProductRepository { //usar para os testes unitários
  private products: Product[] = [];

  async createProduct(product: Product): Promise<number | null> {
      return this.products.push(product);
  }

  async showProduct(id: number): Promise<Product | null> {
    return this.products.find(p => p.id === id) ?? null;
  }

  async findByName(name: string): Promise<Product | null> {
    return this.products.find((p) => p.name === name) ?? null;
  }
}
