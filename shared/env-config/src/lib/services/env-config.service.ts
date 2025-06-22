import { Injectable } from '@nestjs/common';
import { IEnvInterface } from '../interfaces/env-config.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvConfigService implements IEnvInterface {
  constructor(private configService: ConfigService) {}

  getProductServicePort(): number {
    return Number(this.configService.get<number>('PRODUCT_SERVICE_PORT'));
  }

  getCouponServicePort(): number {
    return Number(this.configService.get<number>('COUPON_SERVICE_PORT'));
  }
  getApiGateWayPort(): number {
    return Number(this.configService.get<number>('API_GATEWAY_PORT'));
  }
}