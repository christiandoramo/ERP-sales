import { Injectable } from '@nestjs/common';
import { PrismaService } from '@erp-product-coupon/prisma-config';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';

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

  async showProduct(id: number): Promise<Product | null> {
    const prismaProduct = await this.prisma.product.findFirst({ where: {id }});
    if (!prismaProduct) return null;

    return Product.restore({  
      id: prismaProduct.id,
      name: prismaProduct.name,
      stock: prismaProduct.stock,
      price: prismaProduct.price.toNumber(),
      description: prismaProduct.description ?? null,
      createdAt: prismaProduct.createdAt,
      updatedAt: prismaProduct.updatedAt,
      deletedAt: prismaProduct.deletedAt ?? null,
    });
  }

}
