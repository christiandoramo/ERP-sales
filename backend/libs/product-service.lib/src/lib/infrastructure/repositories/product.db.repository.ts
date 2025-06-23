// libs/product-service.lib/src/lib/infrastructure/repositories/product.db.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../shared/prisma-config/src/index';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';
import {
  IndexProductsInput,
  IndexProductsOutput,
} from '../../domain/interfaces/index-product';
import { ProductWithDiscount } from '../../domain/entities/product-with-discount';
import {
  ApplyCouponToProductInput,
  ApplyDiscountInput,
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

  // async indexProducts(input: IndexProductsInput): Promise<IndexProductsOutput> {
  //   const {
  //     page = 1,
  //     limit = 10,
  //     search,
  //     minPrice,
  //     maxPrice,
  //     sortBy = 'createdAt',
  //     sortOrder = 'desc',
  //     includeDeleted = false,
  //     onlyOutOfStock = false,
  //     withCouponApplied = false,
  //   } = input;
  //   const priceFilter =
  //     minPrice !== undefined || maxPrice !== undefined
  //       ? {
  //           price: {
  //             ...(minPrice !== undefined && { gte: minPrice }),
  //             ...(maxPrice !== undefined && { lte: maxPrice }),
  //           },
  //         }
  //       : {};

  //   const where: any = {
  //     ...(search && {
  //       name: {
  //         contains: search,
  //         mode: 'insensitive',
  //       },
  //     }),
  //     ...priceFilter,
  //     ...(onlyOutOfStock && { stock: 0 }),
  //     ...(includeDeleted ? {} : { deletedAt: null }),
  //   };

  //   console.log({
  //     page,
  //     limit,
  //     skip: (page - 1) * limit,
  //   });
  //   const [totalItems, items] = await this.prisma.$transaction([
  //     this.prisma.product.count({ where }),
  //     this.prisma.product.findMany({
  //       where,
  //       orderBy: { [sortBy]: sortOrder },
  //       skip: (page - 1) * limit,
  //       take: limit,
  //     }),
  //   ]);

  //   if (!items.length)
  //     return {
  //       data: [],
  //       meta: {
  //         page,
  //         limit,
  //         totalItems,
  //         totalPages: Math.ceil(totalItems / limit),
  //       },
  //     };

  //   const data = items.map((p) => {
  //     const discount = null; // TODO: aplicar regra real de desconto/cupom
  //     const finalPrice = p.price.toNumber();
  //     const hasCouponApplied = withCouponApplied ? false : false;

  //     return {
  //       id: p.id,
  //       name: p.name,
  //       description: p.description,
  //       stock: p.stock,
  //       isOutOfStock: p.stock === 0,
  //       price: p.price.toNumber(),
  //       finalPrice,
  //       hasCouponApplied,
  //       discount,
  //       createdAt: p.createdAt.toISOString(),
  //       updatedAt: p.updatedAt.toISOString(),
  //     };
  //   });

  //   return {
  //     data,
  //     meta: {
  //       page,
  //       limit,
  //       totalItems,
  //       totalPages: Math.ceil(totalItems / limit),
  //     },
  //   };
  // }

  // async getProductWithDiscount(
  //   productId: number
  // ): Promise<ProductWithDiscount | null> {
  //   const productWithoutDiscount = await this.prisma.product.findUnique({
  //     where: { id: productId },
  //   });
  //   if (!productWithoutDiscount) return null;

  //   const product: ProductWithDiscount | null = {
  //     discount: null,
  //     ...productWithoutDiscount,
  //     price: productWithoutDiscount.price.toNumber(),
  //   };

  //   const couponApplication =
  //     await this.prisma.productCouponApplication.findFirst({
  //       where: { productId, removedAt: null },
  //       orderBy: { appliedAt: 'desc' },
  //       include: { coupon: true },
  //     });
  //   product.discount = !!couponApplication
  //     ? {
  //         type: couponApplication?.coupon.type,
  //         value: couponApplication?.coupon.value.toNumber(),
  //         appliedAt: couponApplication?.appliedAt,
  //       }
  //     : null;

  //   if (couponApplication) return product;

  //   // desconto percentual
  //   const percentDiscount = await this.prisma.productPercentDiscount.findFirst({
  //     where: { productId },
  //     orderBy: { appliedAt: 'desc' },
  //   });

  //   product.discount = !!percentDiscount
  //     ? {
  //         type: 'percent',
  //         value: percentDiscount.value,
  //         appliedAt: percentDiscount.appliedAt,
  //       }
  //     : null;

  //   if (couponApplication) return product;

  //   return new ProductWithDiscount(
  //     product.id,
  //     product.name,
  //     product.stock,
  //     product.price,
  //     product.createdAt,
  //     product.updatedAt,
  //     product.deletedAt,
  //     product.description,
  //     null
  //   );
  // }

  async getProductWithDiscount(
    productId: number
  ): Promise<ProductWithDiscount | null> {
    const productWithoutDiscount = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!productWithoutDiscount) return null;

    // Verifica se há cupom aplicado
    const couponApplication =
      await this.prisma.productCouponApplication.findFirst({
        where: { productId, removedAt: null },
        orderBy: { appliedAt: 'desc' },
        include: { coupon: true },
      });

    if (couponApplication) {
      const discount = {
        type: couponApplication.coupon.type,
        value: couponApplication.coupon.value.toNumber(),
        appliedAt: couponApplication.appliedAt,
      };

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

    // Verifica se há desconto percentual
    const percentDiscount = await this.prisma.productPercentDiscount.findFirst({
      where: { productId },
      orderBy: { appliedAt: 'desc' },
    });

    if (percentDiscount) {
      const discount = {
        type: 'percent' as 'fixed' | 'percent',
        value: percentDiscount.value,
        appliedAt: percentDiscount.appliedAt,
      };

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

    //   // ✅ Sem nenhum desconto: retorna null
    //   return null;
    // }
    return new ProductWithDiscount(
      productWithoutDiscount.id,
      productWithoutDiscount.name,
      productWithoutDiscount.stock,
      productWithoutDiscount.price.toNumber(),
      productWithoutDiscount.createdAt,
      productWithoutDiscount.updatedAt,
      productWithoutDiscount.deletedAt,
      productWithoutDiscount.description,
      null // <- desconto nulo
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

    const data = await Promise.all(
      items.map(async (item) => {
        const fullProduct = await this.getProductWithDiscount(item.id);
        if (!fullProduct) return null;
        const discount = fullProduct?.discount;
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
          hasCouponApplied: discount?.type === 'fixed',
          discount,
          createdAt: fullProduct.createdAt,
          updatedAt: fullProduct.updatedAt,
        };
      })
    );

    return {
      data: [],
      meta: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }
}
