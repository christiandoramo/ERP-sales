//libs/product-service.lib/src/lib/infrastructure/repositories/product.in-memo.repository.ts
import { ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';
import {
  IndexProductsInput,
  IndexProductsOutput,
} from '../../domain/interfaces/index-product';
import { ProductWithDiscount } from '../../domain/entities/product-with-discount';
import {
  ApplyDiscountInput,
} from '../../domain/interfaces/discount.interface';
import { NotFoundException } from '@erp-product-coupon/pipe-config';

export class InMemoryProductRepository implements ProductRepository {
  //usar para os testes unitários
  private products: Map<number, Product> = new Map();
private couponApplications: Map<
  number,
  { couponId: number; discount: number }
> = new Map();

  private discountMap: Map<number, { discount: number }> =
    new Map();

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

    const data = await Promise.all(
      paginated.map(async (p) => {
        const withDiscount = await this.getProductWithDiscount(p.id);

        const discount = withDiscount?.discount;
        const finalPrice = discount
          ? discount.type === 'fixed'
            ? p.price - discount.value
            : p.price - (p.price * discount.value) / 100
          : p.price;
        const hasCouponApplied = discount?.type === 'fixed';

        return {
          id: p.id,
          name: p.name,
          description: p.description,
          stock: p.stock,
          isOutOfStock: p.stock === 0,
          price: p.price,
          finalPrice,
          hasCouponApplied,
          discount: discount
            ? {
                type: discount.type,
                appliedAt: new Date(),
                value: discount.value,
              }
            : null,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        };
      })
    );

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

async getProductWithDiscount(productId: number): Promise<ProductWithDiscount | null> {
  const product = this.products.get(productId);
  if (!product) return null;

  if (this.discountMap.has(productId)) {
    const { discount } = this.discountMap.get(productId)!;

    return new ProductWithDiscount(
      product.id,
      product.name,
      product.stock,
      product.price,
      product.createdAt,
      product.updatedAt,
      product.deletedAt,
      product.description,
      {
        type: 'percent',
        value: discount,
        appliedAt: new Date(),
      }
    );
  }

  if (this.couponApplications.has(productId)) {
    const { couponId } = this.couponApplications.get(productId)!;

    return new ProductWithDiscount(
      product.id,
      product.name,
      product.stock,
      product.price,
      product.createdAt,
      product.updatedAt,
      product.deletedAt,
      product.description,
      {
        type: 'fixed', // ou 'percent', se quiser simular no teste
        value: 0, // valor é irrelevante aqui, já foi usado no cálculo no use-case
        appliedAt: new Date(),
      }
    );
  }

  return new ProductWithDiscount(
    product.id,
    product.name,
    product.stock,
    product.price,
    product.createdAt,
    product.updatedAt,
    product.deletedAt,
    product.description,
    null
  );
}



async applyCouponToProduct(input: { productId: number; couponId: number }) {
  this.couponApplications.set(input.productId, {
    couponId: input.couponId,
    discount: 0, // Valor do desconto não importa aqui, pois o cálculo foi feito no use-case
  });
}



  async applyDiscount({
    productId,
    discount,
  }: ApplyDiscountInput): Promise<void> {
    const product = this.products.get(productId);
    if (!product) return
    this.discountMap.set(productId, { discount });
  }
}
