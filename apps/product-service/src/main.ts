// apps/product-service/src/app/main
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvConfigService } from '@erp-product-coupon/env-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(EnvConfigService);
  // Obtém o ConfigService
  const host = 'localhost';

  const tcpPort = configService.getTcpPort()

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host,
      port: tcpPort,
    },
  });

  await app.startAllMicroservices();

  Logger.log(`🚀 Product-service on: ${host}:${tcpPort}`);
}
bootstrap();
