// shared/prisma-config/prisma/seed.ts
import 'dotenv/config';
import { PrismaClient } from '../generated/prisma';
import { faker } from '@faker-js/faker/locale/pt_BR';

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();

  const total = await prisma.product.count();
  if (total > 0) {
    console.warn(
      `O banco já contém ${total} produtos. Seed cancelado para evitar duplicações.`
    );
    await prisma.$disconnect();
    return;
  }

  const products = Array.from({ length: 100 }).map(() => ({
    name: `${faker.commerce.productName()} ${faker.number.int(9999)}`,
    price: parseFloat(faker.commerce.price({ min: 0.01, max: 1000000 })),
    stock: faker.number.int({ min: 0, max: 999_999 }),
    description: faker.commerce.productDescription(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await prisma.product.createMany({
    data: products,
    skipDuplicates: true,
  });

  const now = new Date();
  const oneYearLater = new Date(now);
  oneYearLater.setFullYear(now.getFullYear() + 1);

  const coupons = [
    { code: 'FRETE10', type: 'fixed' as 'fixed' | 'percent', value: 10 },
    { code: 'QUEIMA20', type: 'fixed' as 'fixed' | 'percent', value: 20 },
    { code: 'SAIR50', type: 'fixed' as 'fixed' | 'percent', value: 50 },
    { code: 'SUPER5', type: 'fixed' as 'fixed' | 'percent', value: 5 },
    { code: 'LIQUIDA30', type: 'fixed' as 'fixed' | 'percent', value: 30 },
    { code: 'BONUS15', type: 'fixed' as 'fixed' | 'percent', value: 15 },
    { code: 'PROMO10', type: 'percent' as 'fixed' | 'percent', value: 10 },
    { code: 'DESCONTA25', type: 'percent' as 'fixed' | 'percent', value: 25 },
    { code: 'QUERO30', type: 'percent' as 'fixed' | 'percent', value: 30 },
    { code: 'OFERTA15', type: 'percent' as 'fixed' | 'percent', value: 15 },
    { code: 'FESTA5', type: 'percent' as 'fixed' | 'percent', value: 5 },
    { code: 'MEGA40', type: 'percent' as 'fixed' | 'percent', value: 40 },
  ].map((c) => ({
    ...c,
    oneShot: false,
    maxUses: 10,
    validFrom: now,
    validUntil: oneYearLater,
    createdAt: now,
    updatedAt: now,
  }));

  await prisma.coupon.createMany({ data: coupons, skipDuplicates: true });

  console.log(
    `✅ Seed concluído com ${products.length} produtos e ${coupons.length} cupons criados`
  );

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Erro ao executar o seed:', err);
  process.exit(1);
});
