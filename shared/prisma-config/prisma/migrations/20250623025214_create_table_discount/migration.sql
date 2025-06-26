-- CreateTable
CREATE TABLE "product_percent_discounts" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "applied_at" TIMESTAMP(3) NOT NULL,
    "removed_at" TIMESTAMP(3),

    CONSTRAINT "product_percent_discounts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "product_percent_discounts" ADD CONSTRAINT "product_percent_discounts_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
