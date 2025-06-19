import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCT_SERVICE_PRODUCER',          // para publicar eventos de saída
        transport: Transport.KAFKA,
        options: {
          client: { brokers: ['kafka:9092'] },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class KafkaModule {}
