import { Injectable } from '@nestjs/common';
import { PrismaService } from '@erp-product-coupon/prisma-config';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';

@Injectable()
export class DbProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(product: Product): Promise<number | null> {
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
}
