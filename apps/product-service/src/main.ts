// apps/product-service/src/app/main
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { EnvConfigService } from '@erp-product-coupon/env-config';
import { RpcDomainExceptionFilter } from './app/infra/filters/rpc-domain-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(EnvConfigService);
  const host = 'localhost';
  const tcpPort = configService.getTcpPort()

   const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host,
      port: tcpPort,
    },
  });


  microservice.useGlobalFilters(new RpcDomainExceptionFilter());


  await app.startAllMicroservices();

  Logger.log(`🚀 Product-service on: ${host}:${tcpPort}`);
}
bootstrap();
