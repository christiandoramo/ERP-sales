//libs/product-service.lib/src/lib/infrastructure/repositories/product.in-memo.repository.ts
import { ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';
import {
  IndexProductsInput,
  IndexProductsOutput,
} from '../../domain/interfaces/index-product';
import { ProductWithDiscount } from '../../domain/entities/product-with-discount';
import { ApplyDiscountInput } from '../../domain/interfaces/discount.interface';
import { NotFoundException } from '@erp-product-coupon/pipe-config';
import {
  RemovePercentDiscountInput,
  RemoveCouponApplicationInput,
} from '../../domain/interfaces/remove-discount.input';

export class InMemoryProductRepository implements ProductRepository {
  //usar para os testes unitários
  private products: Map<number, Product> = new Map();
  private couponApplications: Map<
    number,
    { couponId: number; discount: number }
  > = new Map();

  private discountMap: Map<number, { discount: number }> = new Map();

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
  const limit = params?.limit ?? 10;

  if (!allProducts.length) {
    return {
      data: [],
      meta: {
        page,
        limit,
        totalItems: 0,
        totalPages: 0,
      },
    };
  }

  // FILTRO
  const filtered = allProducts.filter(
    (p) =>
      (!params?.search ||
        p.name.toLowerCase().includes(params.search.toLowerCase())) &&
      (params?.minPrice === undefined || p.price >= params.minPrice) &&
      (params?.maxPrice === undefined || p.price <= params.maxPrice) &&
      (!params?.onlyOutOfStock || p.stock === 0) &&
      (!params?.includeDeleted ? p.deletedAt === null : true)
  );

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / limit);

  // ORDENAÇÃO
  const sortBy = params?.sortBy ?? 'createdAt';
  const sortOrder = params.sortOrder ?? 'desc';

  const sorted = filtered.sort((a, b) => {
    const valA = a[sortBy];
    const valB = b[sortBy];

    return sortOrder === 'desc'
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

  // PAGINAÇÃO
  const paginated = sorted.slice((page - 1) * limit, page * limit);

  // MAPEIA PARA SAÍDA FINAL
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
        finalPrice: Math.max(0, Math.round(finalPrice * 100) / 100),
        hasCouponApplied,
        discount: discount
          ? {
              type: discount.type,
              appliedAt: discount.appliedAt,
              value: discount.value,
            }
          : null,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        deletedAt: p.deletedAt,
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


  async getProductWithDiscount(
    productId: number
  ): Promise<ProductWithDiscount | null> {
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
    if (!product) return;
    this.discountMap.set(productId, { discount });
  }

  softDeleteProduct(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
  restoreProduct(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
  removeDiscount(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findProductWithPercentsAndCoupons(
    productId: number
  ): Promise<ProductWithDiscount | null> {
    throw new Error('Method not implemented.');
  }

  removePercentDiscount(input: RemovePercentDiscountInput): Promise<void> {
    throw new Error('Method not implemented.');
  }
  removeCouponApplication(input: RemoveCouponApplicationInput): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async updateProduct(id: number, patch: Partial<Product>): Promise<Product | null> {
  const product = this.products.get(id);
  if (!product) return null;

  const updated = new Product(
    id,
    patch.name ?? product.name,
    patch.stock ?? product.stock,
    patch.price ?? product.price,
    product.createdAt,
    new Date(),
    patch.hasOwnProperty('deletedAt') ? patch.deletedAt ?? null : product.deletedAt,
    patch.description ?? product.description
  );

  this.products.set(id, updated);
  return updated;
}

}
