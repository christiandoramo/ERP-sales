// env-config/src/lib/env-config.module.ts
import { DynamicModule, Global, Module } from '@nestjs/common';
import { EnvConfigService } from './services/env-config.service';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { join } from 'path';

@Global()
@Module({})
export class EnvConfigModule {
  static forRoot(options: ConfigModuleOptions = {}): DynamicModule {
    return {
      module: EnvConfigModule,
      imports: [
        ConfigModule.forRoot({
          ...options,
          isGlobal: true, // opcional se quiser que o ConfigModule seja global
          envFilePath: [join(__dirname, `../../../.env.${process.env['NODE_ENV']}`)],
        }),
      ],
      providers: [EnvConfigService],
      exports: [EnvConfigService, ConfigModule],
    };
  }
}
