// api-gateway/src/app/infrastructure/transport/transport.module.ts
import { Module, Inject, OnModuleInit } from '@nestjs/common';
import { EnvConfigService } from '@erp-product-coupon/env-config';
import { ClientsModule, Transport, ClientProxy } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'PRODUCT_SERVICE',
        useFactory: (configService: EnvConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: 'localhost',
            port: configService.getProductServicePort(),
          },
        }),
        inject: [EnvConfigService],
      },
      {
        name: 'COUPON_SERVICE',
        useFactory: (configService: EnvConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: 'localhost',
            port: configService.getCouponServicePort(), // precisa criar esse getter no EnvConfigService
          },
        }),
        inject: [EnvConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class TransportModule implements OnModuleInit {
  constructor(
        @Inject('PRODUCT_SERVICE') private readonly productClient: ClientProxy,
        @Inject('COUPON_SERVICE') private readonly couponClient: ClientProxy,
      ) {}

async onModuleInit() {
    await Promise.all([
      this.productClient.connect(),
      this.couponClient.connect(),
    ]);
  }
}