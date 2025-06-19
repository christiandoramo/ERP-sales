// auth/src/app/main
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const port:string = process.env.KAFKA_PORT
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
                brokers: [`localhost:${9092}`],
        //brokers: [`kafka:${port}`],
      },
      consumer: {
        groupId: 'product-service-consumer',
      },
    },
  });

  await app.listen();
    Logger.log(
    `🚀 AUTH on: ${port} - localhost(local) / kafka(docker)`
  );
}
bootstrap();

