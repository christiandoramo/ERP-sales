//libs/product-service.lib/src/lib/infrastructure/repositories/product.in-memo.repository.ts
import { ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';
import {
  IndexProductsInput,
  IndexProductsOutput,
} from '../../domain/interfaces/index.product';

export class InMemoryProductRepository implements ProductRepository {
  //usar para os testes unitários
  private products: Map<number, Product> = new Map();
  private nextId: number = 1;

  async createProduct(product: Product): Promise<number | null> {
    const newProduct: Product = { ...product, id: this.nextId++ };
    this.products.set(newProduct.id, newProduct);
    return newProduct.id;
  }

  async createMany(products: Product[]): Promise<number> {
    let count = 0;
    if (!products.length) return 0;
    products.forEach((p) => {
      const newProduct: Product = { ...p, id: this.nextId++ };
      this.products.set(newProduct.id, newProduct);
      count++;
    });
    return count;
  }

  async showProduct(id: number): Promise<Product | null> {
    return this.products.get(id) || null;
  }

  async findByName(name: string): Promise<Product | null> {
    return (
      Array.from(this.products.values()).find((p) => p.name === name) ?? null
    );
  }

  async indexProducts(
    params: IndexProductsInput
  ): Promise<IndexProductsOutput> {
    const allProducts = Array.from(this.products.values());

    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10; // limite padrão

    if (!allProducts.length)
      return {
        data: [],
        meta: {
          page,
          limit,
          totalItems: 0,
          totalPages: 0,
        },
      };

    const sortBy = params?.sortBy ?? 'createdAt'; // por data de criação
    const sortOrder = params.sortOrder ?? 'desc'; // mais novo para o mais velho

    let filtered = allProducts.filter(
      (p) =>
        (!params?.search ||
          p.name.toLowerCase().includes(params?.search.toLowerCase())) &&
        (params?.minPrice === undefined || p.price >= params?.minPrice) &&
        (params?.maxPrice === undefined || p.price <= params?.maxPrice) &&
        (!params?.onlyOutOfStock || p.stock === 0) &&
        (params?.includeDeleted || p.deletedAt === null)
    );
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / limit);

    const sorted = filtered.sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];
      return sortOrder === 'desc' // se do maior para o maior primeira linha se não segunda do menor para maior
        ? valA < valB
          ? 1
          : valA > valB
          ? -1
          : 0
        : valA > valB
        ? 1
        : valA < valB
        ? -1
        : 0;
    });

    const paginated = sorted.slice((page - 1) * limit, page * limit); // só vai tratar os descontos do que carregou agora

    const data = paginated.map((p) => {
      const discount = null; // TODO: aplicar regra de desconto real baseado em cupom/campanha
      const hasCouponApplied = false; // TODO: calcular baseado em coupon system
      const finalPrice = p.price;

      return {
        id: p.id,
        name: p.name,
        description: p.description,
        stock: p.stock,
        isOutOfStock: p.stock === 0,
        price: p.price,
        finalPrice,
        hasCouponApplied,
        discount,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
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
