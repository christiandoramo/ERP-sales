// apps/api-gateway/src/app/app.module.ts
import { Module } from '@nestjs/common';
import { HelloWorldController } from './presentation/controllers/hello.controller';
import { TransportModule } from './infrastructure/transport/transport.module';
import {EnvConfigModule } from '@erp-product-coupon/env-config';

@Module({
  imports: [EnvConfigModule.forRoot(), TransportModule],
  controllers: [HelloWorldController],
  providers: [],
})
export class AppModule {}
