import { Injectable } from '@nestjs/common';
import { IEnvInterface } from '../interfaces/env-config.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvConfigService implements IEnvInterface {
    constructor(private configService: ConfigService) {}

    getTcpPort(): number {
        return Number(this.configService.get<number>('TCP_PORT'));
    }
    getApiGateWayPort(): number {
        return Number(this.configService.get<number>('API_GATEWAY_PORT'));
    }
    getProductServicePort(): number {
        return Number(this.configService.get<number>('PRODUCT_SERVICE_PORT'));
    }
}