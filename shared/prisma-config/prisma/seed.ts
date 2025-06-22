// shared/prisma-config/prisma/seed.ts
import 'dotenv/config';
import { PrismaClient } from "../generated/prisma";
import { faker } from '@faker-js/faker/locale/pt_BR';

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();

  const total = await prisma.product.count();
  if (total > 0) {
    console.warn(`⚠️ O banco já contém ${total} produtos. Seed cancelado para evitar duplicações.`);
    await prisma.$disconnect();
    return;
  }

  const products = Array.from({ length: 20 }).map(() => ({
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

  console.log(`✅ Seed concluído com ${products.length} produtos criados.`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Erro ao executar o seed:', err);
  process.exit(1);
});
