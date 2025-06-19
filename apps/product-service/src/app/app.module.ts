import { Module } from '@nestjs/common';
import {ProductServicePresentationModule} from '@erp-sales/product-service.presentation'

@Module({
  imports: [ProductServicePresentationModule],
})
export class AppModule {}