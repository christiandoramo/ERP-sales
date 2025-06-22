// libs/product-service.lib/src/lib/infrastructure/repositories/product.db.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../shared/prisma-config/src/index';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';
import {
  IndexProductsInput,
  IndexProductsOutput,
} from '../../domain/interfaces/index.product';

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

  // libs/product-service.lib/src/lib/infrastructure/repositories/product.db.repository.ts

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
      withCouponApplied = false,
      hasDiscount = false,
    } = input;


    const priceFilter =
      minPrice !== undefined || maxPrice !== undefined
        ? {
            price: {
              ...(minPrice !== undefined && { gte: minPrice }),
              ...(maxPrice !== undefined && { lte: maxPrice }),
            },
          }
        : {};

    const where: any = {
      ...(search && {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      }),
      ...priceFilter,
      ...(onlyOutOfStock && { stock: 0 }),
      ...(includeDeleted ? {} : { deletedAt: null }),
    };

    console.log({
  page,
  limit,
  skip: (page - 1) * limit
});
    const [totalItems, items] = await this.prisma.$transaction([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    if (!items.length)
      return {
        data: [],
        meta: {
          page,
          limit,
          totalItems,
          totalPages: Math.ceil(totalItems / limit),
        },
      };

    const data = items.map((p) => {
      const discount = null; // TODO: aplicar regra real de desconto/cupom
      const finalPrice = p.price.toNumber();
      const hasCouponApplied = withCouponApplied ? false : false;

      return {
        id: p.id,
        name: p.name,
        description: p.description,
        stock: p.stock,
        isOutOfStock: p.stock === 0,
        price: p.price.toNumber(),
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
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }
}
