import { Module } from '@nestjs/common';
import { ProductServiceApplicationModule } from '@erp-sales/product-service.application';
import { HelloWorldController } from './controllers/helloword.controller';

@Module({
  imports: [ProductServiceApplicationModule],
  controllers: [HelloWorldController],
  providers: [],
  exports: [],
})
export class ProductServicePresentationModule {}
