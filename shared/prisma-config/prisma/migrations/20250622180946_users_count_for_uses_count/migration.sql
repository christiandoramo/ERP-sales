/*
  Warnings:

  - You are about to drop the column `users_count` on the `coupons` table. All the data in the column will be lost.
  - Added the required column `uses_count` to the `coupons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "coupons" DROP COLUMN "users_count",
ADD COLUMN     "uses_count" INTEGER NOT NULL;
