// libs/coupon-service.lib/src/lib/infrastructure/repositories/coupon.db.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@erp-product-coupon/prisma-config';
import { CouponRepository } from '../../domain/repositories/coupon.repository';
import { Coupon } from '../../domain/entities/coupon.entity';
import { IndexCouponsInput, IndexCouponsOutput } from '../../domain/interfaces/index-coupon';
import { COUPON_TYPE } from 'shared/prisma-config/generated/prisma';

@Injectable()
export class DbCouponRepository implements CouponRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createCoupon(coupon: Coupon): Promise<number> {
    const created = await this.prisma.coupon.create({
      data: {
        code: coupon.code,
        type: coupon.type as COUPON_TYPE,
        value: coupon.value,
        oneShot: coupon.oneShot,
        maxUses: coupon.maxUses,
        validFrom: coupon.validFrom,
        validUntil: coupon.validUntil,
        createdAt: coupon.createdAt,
        updatedAt: coupon.updatedAt,
        deletedAt: coupon.deletedAt,
      },
    });
    return created.id;
  }

  async createMany(coupons: Coupon[]): Promise<number> {
    if (!coupons.length) return 0;
    const created = await this.prisma.coupon.createMany({
      data: coupons.map(c => ({
        code: c.code,
        type: c.type,
        value: c.value,
        oneShot: c.oneShot,
        maxUses: c.maxUses,
        validFrom: c.validFrom,
        validUntil: c.validUntil
      })),
      skipDuplicates: true,
    });
    return created.count;
  }

  async findByName(code: string): Promise<Coupon | null> {
    const found = await this.prisma.coupon.findFirst({ where: { code } });
    if (!found) return null;

    return Coupon.restore({
      id: found.id,
      code: found.code,
      type: found.type as Coupon["type"],
      value: Number(found.value),
      oneShot: found.oneShot,
      maxUses: found.maxUses,
      usesCount: found.usesCount,
      validFrom: found.validFrom,
      validUntil: found.validUntil,
      createdAt: found.createdAt,
      updatedAt: found.updatedAt,
      deletedAt: found.deletedAt,
    });
  }

  async showCoupon(id: number): Promise<Coupon | null> {
    const found = await this.prisma.coupon.findUnique({ where: { id } });
    if (!found) return null;

    return Coupon.restore({
      id: found.id,
      code: found.code,
      type: found.type as Coupon["type"],
      value: Number(found.value),
      oneShot: found.oneShot,
      maxUses: found.maxUses,
      usesCount: found.usesCount,
      validFrom: found.validFrom,
      validUntil: found.validUntil,
      createdAt: found.createdAt,
      updatedAt: found.updatedAt,
      deletedAt: found.deletedAt,
    });
  }

  async indexCoupons({ page = 1, limit = 10 }: IndexCouponsInput): Promise<IndexCouponsOutput> {
    const [totalItems, items] = await this.prisma.$transaction([
      this.prisma.coupon.count(),
      this.prisma.coupon.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    const data = items.map((c) => ({
      id: c.id,
      code: c.code,
      type: c.type as Coupon["type"],
      value: Number(c.value),
      oneShot: c.oneShot,
      maxUses: c.maxUses,
      usesCount: c.usesCount,
      
      validFrom: c.validFrom,
      validUntil: c.validUntil,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

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
