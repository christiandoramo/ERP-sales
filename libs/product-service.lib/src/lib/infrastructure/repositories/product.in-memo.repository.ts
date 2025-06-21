import { ProductRepository } from '../../domain/repositories/product.repository'
import { Product} from '../../domain/entities/product.entity'

export class InMemoryProductRepository implements ProductRepository { //usar para os testes unitários
  private products: Product[] = [];

  async createProduct(product: Product): Promise<any> {
    this.products.push(product);
  }

  async showProduct(id: number): Promise<any> {
    this.products.find(p => p.id === id);
  }
}
