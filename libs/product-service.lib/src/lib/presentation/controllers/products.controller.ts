import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case';
import {
  CreateProductDto,
  createProductValidationPipe,
} from '../dtos/create-product.dto';
import {
  IndexProductsDto,
  indexProductsValidationPipe,indexProductsSchema
} from '../dtos/index-product.dto';
import { IndexProductsUseCase } from '../../application/use-cases/index-product.use-case';
import { wrapRpc } from '@erp-product-coupon/pipe-config';
import { IndexProductsInput } from '../../domain/interfaces/index.product';


@Controller()
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly indexProductsUseCase: IndexProductsUseCase
  ) {}

  @MessagePattern('product.create')
  async handleCreate(
    @Payload(createProductValidationPipe) payload: CreateProductDto
  ) {
    return wrapRpc(async () => {
      const { name, price, stock } = payload;
      return await this.createProductUseCase.execute({
        description: payload?.description ?? null,
        name,
        price,
        stock,
      });
    })();
  }

  @MessagePattern('product.index')
  async handleIndex(
    @Payload(indexProductsValidationPipe) payload: IndexProductsDto
  ) {
    return wrapRpc(async () => {
          const parsed: IndexProductsInput = indexProductsSchema.parse(payload);
    return await this.indexProductsUseCase.execute(parsed);
    })();
  }
}
