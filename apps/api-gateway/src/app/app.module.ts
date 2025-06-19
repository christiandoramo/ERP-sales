import { Module } from '@nestjs/common';
import { HelloController } from './presentation/controllers/hello.controller';
import { KafkaModule } from './infrastructure/kafka/kafka.module';

@Module({
  imports: [KafkaModule],
  controllers: [HelloController],
  providers: [],
})
export class AppModule {}
