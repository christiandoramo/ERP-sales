//shared/prisma-config/src/lib/seed.ts
import { PrismaService } from './prisma.service';
import { DbProductRepository } from '../../../../libs/product-service.lib/src/lib/infrastructure/repositories/product.db.repository';
import { Product } from '../../../../libs/product-service.lib/src/lib/domain/entities/product.entity';

import { faker } from '@faker-js/faker/locale/pt_BR';

async function main() {
  console.log("main 1")
  const prisma = new PrismaService();
    console.log("main 2")

  await prisma.$connect();

    console.log("main 3")

  const total = await prisma.product.count();
  console.log("main 4")

  if (total > 0) {
    console.warn(`⚠️ O banco já contém ${total} produtos. Seed cancelado para evitar duplicações.`);
    await prisma.$disconnect();
    return;
  }

    console.log("main 5")


  const repository = new DbProductRepository(prisma);

    console.log("main 6")

  const products: Product[] = [];

    console.log("main 7")

  for (let i = 0; i < 20; i++) {
    try {
      const name = `${faker.commerce.productName()} ${faker.number.int(9999)}`;
      const stock = faker.number.int({ min: 0, max: 999_999 });
      const price = parseFloat(faker.commerce.price({ min: 0.01, max: 1000000 }));
      const description = faker.commerce.productDescription();

      const product = Product.create({ name, stock, price, description });
      products.push(product);
    } catch (err) {
      console.error(`Erro ao criar produto ${i + 1}:`, (err as Error).message);
    }
  }

  const count = await repository.createMany(products);
  console.log(`✅ Seed concluído com ${count} produtos criados.`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Erro ao executar o seed:', (err as Error).message);
  process.exit(1);
});
