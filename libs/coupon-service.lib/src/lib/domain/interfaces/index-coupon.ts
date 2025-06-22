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
  validFrom: string;
  validUntil: string;
  createdAt: string;
  updatedAt: string;
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
