// apps/api-gateway/src/main.ts
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { EnvConfigService } from '@erp-product-coupon/env-config';// não consegue usar
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestJsSwagger } from 'nestjs-zod';
import { RpcExceptionInterceptor} from './app/infrastructure/interceptors/rpc-exception.interceptor'
import * as bodyParser from 'body-parser';


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


    patchNestJsSwagger();

  const config = new DocumentBuilder()
    .setTitle('Documentação: ERP products coupon')
    .setDescription(
      'Documentação da API do projeto ERP products coupon, desenvolvido para desafio técnico do Instituto Senai de Inovação (06/2025).\nCada rota possui um exemplo de quais dados enviar na requisição e o que será devolvido resposta.',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Documentação: ERP products coupon',
    customfavIcon: './fiepe-favicon.jpeg',
  });


  // app.useGlobalInterceptors(new LocationHeaderInterceptor());
  app.useGlobalInterceptors(new RpcExceptionInterceptor());

    app.use(
    bodyParser.json({ type: ['application/json', 'application/json-patch+json'] })
  );
  await app.listen(port);

  Logger.log(
    `🚀 API-Gateway on: ${host}:${port}/${globalPrefix}`
  );
}

bootstrap();
