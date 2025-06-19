import { Module } from '@nestjs/common';
import { KafkaModule } from './middleware/kafka/kafka.module';
import { PrismaModule } from './database/prisma/prisma.module';

@Module({
  imports: [KafkaModule, PrismaModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class ProductServiceInfrastructureModule {}
