// libs/product-service.lib/src/lib/infrastructure/repositories/product.db.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../shared/prisma-config/src/index';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';
import {
  IndexProductsInput,
  IndexProductsOutput,
  ProductListItemOutput,
} from '../../domain/interfaces/index-product';
import { ProductWithDiscount } from '../../domain/entities/product-with-discount';
import {
  ApplyCouponToProductInput,
  ApplyDiscountInput,
  DiscountInterface,
} from '../../domain/interfaces/discount.interface';

@Injectable()
export class DbProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(product: Product): Promise<number> {
    const created = await this.prisma.product.create({
      data: {
        name: product.name,
        price: product.price,
        stock: product.stock,
        description: product.description,
      },
    });
    return created.id;
  }

  async createMany(products: Product[]): Promise<number> {
    if (!products.length) return 0;

    const created = await this.prisma.product.createMany({
      data: products.map((p) => ({
        name: p.name,
        price: p.price,
        stock: p.stock,
        description: p.description,
      })),
      skipDuplicates: true, // evita erro caso nome esteja duplicado
    });
    return created.count;
  }

  async findByName(name: string): Promise<Product | null> {
    const found = await this.prisma.product.findFirst({ where: { name } });
    if (!found) return null;

    return Product.restore({
      id: found.id,
      name: found.name,
      stock: found.stock,
      price: found.price.toNumber(),
      description: found.description,
      createdAt: found.createdAt,
      updatedAt: found.updatedAt,
      deletedAt: found.deletedAt,
    });
  }
  async showProduct(id: number): Promise<Product | null> {
    const found = await this.prisma.product.findFirst({ where: { id } });
    if (!found) return null;

    return Product.restore({
      id: found.id,
      name: found.name,
      stock: found.stock,
      price: found.price.toNumber(),
      description: found.description,
      createdAt: found.createdAt,
      updatedAt: found.updatedAt,
      deletedAt: found.deletedAt,
    });
  }

async getProductWithDiscount(productId: number): Promise<ProductWithDiscount | null> {
  // Dispara as 3 queries em paralelo
  const [
    productWithoutDiscount,
    couponApplication,
    percentDiscount
  ] = await Promise.all([
    this.prisma.product.findUnique({ where: { id: productId } }),
    this.prisma.productCouponApplication.findFirst({
      where: { productId, removedAt: null },
      orderBy: { appliedAt: 'desc' },
      include: { coupon: true },
    }),
    this.prisma.productPercentDiscount.findFirst({
      where: { productId },
      orderBy: { appliedAt: 'desc' },
    }),
  ]);

  if (!productWithoutDiscount) return null;

  let discount: DiscountInterface | null = null;

  if (!!couponApplication) {
    discount = {
      type: couponApplication.coupon.type,
      value: couponApplication.coupon.value.toNumber(),
      appliedAt: couponApplication.appliedAt,
    };
  } else if (!!percentDiscount) {
    discount = {
      type: 'percent',
      value: percentDiscount.value,
      appliedAt: percentDiscount.appliedAt,
    };
  }

  return new ProductWithDiscount(
    productWithoutDiscount.id,
    productWithoutDiscount.name,
    productWithoutDiscount.stock,
    productWithoutDiscount.price.toNumber(),
    productWithoutDiscount.createdAt,
    productWithoutDiscount.updatedAt,
    productWithoutDiscount.deletedAt,
    productWithoutDiscount.description,
    discount
  );
}

  async applyCouponToProduct({
  productId,
  couponId,
}: ApplyCouponToProductInput): Promise<void> {
  await this.prisma.$transaction([ // TRANsaction não pode aplicar coupon sem registrar o uso - "ACID"
    this.prisma.productCouponApplication.create({
      data: {
        productId,
        couponId,
      },
    }),
    this.prisma.coupon.update({
      where: { id: couponId },
      data: { usesCount: { increment: 1 } },
    }),
  ]);
}

  async applyDiscount({
    // aqui realmente tem que salvar o desconto percentual - não é o valor final
    productId,
    discount,
  }: ApplyDiscountInput): Promise<void> {
    await this.prisma.productPercentDiscount.create({
      data: {
        value: discount,
        productId,
      },
    });
  }

  async indexProducts(input: IndexProductsInput): Promise<IndexProductsOutput> {
    const {
      page = 1,
      limit = 10,
      search,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      includeDeleted = false,
      onlyOutOfStock = false,
    } = input;
  

    const where: any = {
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            price: {
              ...(minPrice !== undefined && { gte: minPrice }),
              ...(maxPrice !== undefined && { lte: maxPrice }),
            },
          }
        : {}),
      ...(onlyOutOfStock && { stock: 0 }),
      ...(includeDeleted ? {} : { deletedAt: null }),
    };
    

    const [totalItems, items] = await this.prisma.$transaction([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);


    let discount:DiscountInterface | null = null
    const data: any[] | ProductListItemOutput[] = await Promise.all(
      items.map(async (item) => {
        const fullProduct = await this.getProductWithDiscount(item.id);
        if (!fullProduct) return null;
        discount = fullProduct?.discount ?? null;
        const finalPrice = discount
          ? discount.type === 'fixed'
            ? fullProduct.price - discount.value
            : fullProduct.price * (1 - discount.value / 100)
          : fullProduct.price;

        return {
          id: fullProduct.id,
          name: fullProduct.name,
          description: fullProduct.description,
          stock: fullProduct.stock,
          isOutOfStock: fullProduct.stock === 0,
          price: fullProduct.price,
          finalPrice: Math.max(0, Math.round(finalPrice * 100) / 100), // 2 casas decimais
          hasCouponApplied: !!discount,
          discount,
          createdAt: fullProduct.createdAt,
          updatedAt: fullProduct.updatedAt,
        };
      })
    )

    return {
      data,
      meta: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }
}
