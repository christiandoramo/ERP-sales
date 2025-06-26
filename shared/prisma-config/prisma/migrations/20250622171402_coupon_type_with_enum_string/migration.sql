/*
  Warnings:

  - Changed the type of `type` on the `coupons` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "COUPON_TYPE" AS ENUM ('percent', 'fixed');

-- AlterTable
ALTER TABLE "coupons" DROP COLUMN "type",
ADD COLUMN     "type" "COUPON_TYPE" NOT NULL;

-- DropEnum
DROP TYPE "CouponType";
