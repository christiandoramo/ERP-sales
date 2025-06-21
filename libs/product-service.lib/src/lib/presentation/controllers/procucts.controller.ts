// libs/product-service.lib/src/lib/presentation/controllers/product.controller.ts

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case';
import { CreateProductDto, createProductValidationPipe } from '../dtos/create-product.dto';

@Controller()
export class ProductController {
  constructor(private readonly createProductUseCase: CreateProductUseCase) {}

  @MessagePattern('product.create')
  async handleCreate(@Payload(createProductValidationPipe) payload: CreateProductDto) {
    return await this.createProductUseCase.execute(payload);
  }
}
