// api-gateway/src/app/infrastructure/transport/transport.module.ts
import { Module, Inject, OnModuleInit } from '@nestjs/common';
import { EnvConfigService } from '@erp-product-coupon/env-config';
import { ClientsModule, Transport, ClientProxy } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'API_GATEWAY', // para publicar eventos de saída
        useFactory: (configService: EnvConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: 'localhost',
            port: configService.getProductServicePort(),
          },
        }),
        inject: [EnvConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class TransportModule implements OnModuleInit {
  constructor(@Inject('API_GATEWAY') private readonly client: ClientProxy) {}

  async onModuleInit() {
    await this.client.connect();
  }
}