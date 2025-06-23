// libs/coupon-service.lib/src/lib/infrastructure/repositories/coupon.in-memo.repository.ts
import { CouponRepository } from '../../domain/repositories/coupon.repository';
import { Coupon } from '../../domain/entities/coupon.entity';
import { IndexCouponsInput, IndexCouponsOutput } from '../../domain/interfaces/index-coupon';

export class InMemoryCouponRepository implements CouponRepository {
  private coupons: Map<number, Coupon> = new Map();
  private nextId: number = 1;

  async createCoupon(coupon: Coupon): Promise<number | null> {
    const newCoupon = Coupon.restore({ ...coupon, id: this.nextId++ });
    this.coupons.set(newCoupon.id, newCoupon);
    return newCoupon.id;
  }

  async createMany(coupons: Coupon[]): Promise<number> {
    let count = 0;
    for (const p of coupons) {
      const newCoupon = Coupon.restore({ ...p, id: this.nextId++ });
      this.coupons.set(newCoupon.id, newCoupon);
      count++;
    }
    return count;
  }

  async showCoupon(id: number): Promise<Coupon | null> {
    return this.coupons.get(id) ?? null;
  }

  async findByName(code: string): Promise<Coupon | null> {
    return [...this.coupons.values()].find(c => c.code === code) ?? null;
  }

  async indexCoupons(input: IndexCouponsInput): Promise<IndexCouponsOutput> {
    const all = [...this.coupons.values()];
    const page = input.page ?? 1;
    const limit = input.limit ?? 10;

    const sorted = all.sort((a, b) => {
      const key = 'createdAt'; // coloquei por ordem alfabética, já que cupom não tem busca refinada
      const order = 'asc';
      const aVal = a[key];
      const bVal = b[key];

      return order === 'asc'
        ? aVal < bVal ? 1 : -1
        : aVal > bVal ? 1 : -1;
    });

    const paginated = sorted.slice((page - 1) * limit, page * limit);

    return {
      data: paginated.map((c) => ({
        id: c.id,
        code: c.code,
        type: c.type,
        value: c.value,
        oneShot: c.oneShot,
        maxUses: c.maxUses,
        usesCount: c.usesCount,
        validFrom: c.validFrom,
        validUntil: c.validUntil,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })),
      meta: {
        page,
        limit,
        totalItems: all.length,
        totalPages: Math.ceil(all.length / limit),
      },
    };
  }
}
