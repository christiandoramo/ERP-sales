// apps/api-gateway/src/main.ts
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { EnvConfigService } from '@erp-product-coupon/env-config';// não consegue usar

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    cors: {
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
      origin: '*',
      allowedHeaders: ['Content-Type', 'Authorization'],
    },
    }
  );
  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);
  const configService = app.get(EnvConfigService);
  const port = configService.getApiGateWayPort()
  const host = 'localhost'

  await app.listen(port);

  Logger.log(
    `🚀 API-gateway on: ${host}:${port}/${globalPrefix}`
  );
}

bootstrap();
