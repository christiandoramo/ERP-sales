export interface IndexCouponsInput {
  page?: number;
  limit?: number;
}

export interface CouponListItemOutput {
  id: number;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  oneShot: boolean;
  maxUses: number;
  usesCount: number;
  validFrom: Date;
  validUntil: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IndexCouponsOutput {
  data: CouponListItemOutput[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
