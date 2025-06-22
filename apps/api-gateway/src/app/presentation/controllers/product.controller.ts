// apps/api-gateway/src/app/presentation/controllers/product.controller.ts

import { Controller, Post, Body, Inject, HttpCode, Get, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateProductDto, createProductValidationPipe, createProductSchema, CreateProductOkResponseDto, createProductOkResponseSchema} from '@erp-product-coupon/product-service.lib'
import { firstValueFrom } from 'rxjs';
import { zodToOpenAPI } from 'nestjs-zod';
import { ApiBody, ApiOkResponse, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocationHeader } from '@erp-product-coupon/pipe-config';
import { IndexProductsDto, IndexProductsOutputDto, indexProductsValidationPipe } from 'libs/product-service.lib/src/lib/presentation/dtos/index-product.dto';

@ApiTags('Produtos')
@Controller('products')
export class ProductController {
  constructor(@Inject('API_GATEWAY') private readonly client: ClientProxy) {}

  // @LocationHeader()

  @Post()
  @HttpCode(201)
  @ApiBody({
    description: 'Cadastrar produto',
    schema: zodToOpenAPI(createProductSchema),
  })
  @ApiResponse({
    status: 201,
    description: 'Produto cadastrado com sucesso',
    schema: zodToOpenAPI(createProductOkResponseSchema),
  })
  @ApiResponse({
    status: 400,
    description: 'Requisição inválida (validação Zod ou regra de negócio)',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflito: nome do produto já existe',
  })
  async createProduct(
    @Body(createProductValidationPipe) body: CreateProductDto,
  
  ) : Promise<CreateProductOkResponseDto | null> {
    return await firstValueFrom(this.client.send('product.create', body));
  }

  @Get()
  @HttpCode(200)
  @ApiQuery({
    description: 'Cadastrar produto',
    schema: zodToOpenAPI(createProductSchema),
  })
  @ApiOkResponse({
    description: 'Busca realizada com sucesso',
    schema: zodToOpenAPI(createProductOkResponseSchema),
  })
  async indexProduct(
    @Query(indexProductsValidationPipe) query: IndexProductsDto,
  
  ) : Promise<IndexProductsOutputDto | null> {
    return await firstValueFrom(this.client.send('product.create', query));
  }
}