-- AlterTable
ALTER TABLE "coupons" ALTER COLUMN "deleted_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "product_coupon_applications" ALTER COLUMN "removed_at" DROP NOT NULL;
