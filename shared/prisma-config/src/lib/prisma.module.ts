// libs/shared-prisma/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService} from  '@erp-product-coupon/prisma-config'

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule{}