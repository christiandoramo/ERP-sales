// gateway/src/app/infrastructure/kafka/kafka.module.ts
import { Module, Inject, OnModuleInit } from '@nestjs/common';
import { ClientsModule, ClientKafka, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CLIENT_SERVICE',
        transport: Transport.KAFKA,
        options: { 
          client: { brokers: ['localhost:9092'] },
          consumer: {
            groupId: 'api-gateway-consumer', // também espera consumir mensagem do worker kafka
          }, 
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class KafkaModule implements OnModuleInit {
  constructor(@Inject('CLIENT_SERVICE') private readonly client: ClientKafka) {}

  async onModuleInit() {
    //  esperamos uma resposta para a pattern 'hello.world'
    this.client.subscribeToResponseOf('hello.world');
    // coneecta o producer/consumer
    await this.client.connect();
  }
}
