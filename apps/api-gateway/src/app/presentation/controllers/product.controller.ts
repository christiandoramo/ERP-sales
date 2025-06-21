// apps/api-gateway/src/app/presentation/controllers/product.controller.ts

import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateProductDto, createProductValidationPipe} from '@erp-product-coupon/product-service.lib'
import { firstValueFrom } from 'rxjs';

@Controller('products')
export class ProductController {
  constructor(@Inject('API_GATEWAY') private readonly client: ClientProxy) {}

  @Post()
  async createProduct(
    @Body(createProductValidationPipe) body: CreateProductDto
  ) {
    return await firstValueFrom(this.client.send('product.create', body));
  }
}