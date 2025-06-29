// apps/api-gateway/src/app/presentation/controllers/product.controller.ts

import {
  Controller,
  Post,
  Body,
  Inject,
  HttpCode,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Delete,
  Header,
  Patch,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateProductDto,
  createProductValidationPipe,
  createProductSchema,
  CreateProductOkResponseDto,
  createProductOkResponseSchema,
  showProductOutputSchema,
  showProductValidationPipe,
  ShowProductDto,
  ShowProductOutputDto,
  SoftDeleteOutputDto,
  RestoreOutputDto,
  updateProductPatchSchema,
  UpdateProductPatchDto,
  UpdateProductOutputPatchDto,
} from '@erp-product-coupon/product-service.lib';
import { firstValueFrom } from 'rxjs';
import { zodToOpenAPI } from 'nestjs-zod';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiPreconditionFailedResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  LocationHeader,
  ZodValidationPipe,
} from '@erp-product-coupon/pipe-config';
import {
  IndexProductsDto,
  IndexProductsOutputDto,
  indexProductsOutputSchema,
  indexProductsSchema,
  indexProductsValidationPipe,
} from 'libs/product-service.lib/src/lib/presentation/dtos/index-product.dto';
import {
  ApplyPercentDiscountDto,
  ApplyPercentDiscountHttpDto,
  applyPercentDiscountHttpValidationPipe,
  ApplyPercentDiscountResponseDto,
  applyPercentDiscountResponseSchema,
  applyPercentDiscountSchema,
  applyPercentDiscountSchemaHttp,
  applyPercentDiscountValidationPipe,
} from 'libs/product-service.lib/src/lib/presentation/dtos/apply-percent-discount.dto';
import {
  ApplyCouponDto,
  ApplyCouponHttpDto,
  applyCouponHttpValidationPipe,
  ApplyCouponResponseDto,
  applyCouponResponseSchema,
  applyCouponSchema,
  applyCouponSchemaHttp,
  applyCouponValidationPipe,
} from 'libs/product-service.lib/src/lib/presentation/dtos/apply-coupon.dto';

@ApiTags('Produtos')
@Controller('products')
export class ProductController {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly client: ClientProxy
  ) {}

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
    @Body(createProductValidationPipe) body: CreateProductDto
  ): Promise<CreateProductOkResponseDto | null> {
    return await firstValueFrom(this.client.send('product.create', body));
  }

  @Get()
  @HttpCode(200)
  @ApiQuery({
    description: 'Buscar produto',
    schema: zodToOpenAPI(indexProductsSchema),
  })
  @ApiOkResponse({
    description: 'Busca realizada com sucesso',
    schema: zodToOpenAPI(indexProductsOutputSchema),
  })
  async indexProduct(
    @Query(indexProductsValidationPipe) query: IndexProductsDto
  ): Promise<IndexProductsOutputDto> {
    return await firstValueFrom(this.client.send('product.index', query));
  }

  @Post(':id/discount/coupon')
  @HttpCode(200)
  @ApiParam({
    name: 'id',
    description: 'ID do produto',
    type: 'int',
    required: true,
  })
  @ApiBody({
    description: 'Aplica cupom promocional',
    schema: zodToOpenAPI(applyCouponSchemaHttp),
  })
  @ApiOkResponse({
    description: 'Cupom aplicado com sucesso',
    schema: zodToOpenAPI(applyCouponResponseSchema),
  })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({ status: 404, description: 'Cupom ou produto não encontrado' })
  @ApiResponse({
    status: 409,
    description:
      'Produto já possui desconto aplicado e/ou Cupom não é mais válido',
  })
  @ApiResponse({
    status: 422,
    description: 'Desconto resultou em valor inválido',
  })
  async applyCoupon(
    @Param('id') id: number,
    @Body(applyCouponHttpValidationPipe) body: ApplyCouponHttpDto
  ): Promise<ApplyCouponResponseDto> {
    return await firstValueFrom(
      this.client.send('product.apply-coupon', {
        productId: +id,
        couponCode: body.couponCode,
      })
    );
  }

  @Post(':id/discount/percent')
  @HttpCode(200)
  @ApiParam({
    name: 'id',
    description: 'ID do produto',
    type: 'int',
    required: true,
  })
  @ApiBody({
    description: 'Aplica desconto percentual direto',
    schema: zodToOpenAPI(applyPercentDiscountSchemaHttp),
  })
  @ApiOkResponse({
    description: 'Desconto percentual aplicado com sucesso',
    schema: zodToOpenAPI(applyPercentDiscountResponseSchema),
  })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({
    status: 409,
    description:
      'Produto já possui desconto aplicado e/ou Cupom não é mais válido',
  })
  @ApiResponse({
    status: 422,
    description: 'Desconto resultou em valor inválido',
  })
  async applyPercentDiscount(
    @Param('id') id: number,
    @Body(applyPercentDiscountHttpValidationPipe)
    body: ApplyPercentDiscountHttpDto
  ): Promise<ApplyPercentDiscountResponseDto> {
    return await firstValueFrom(
      this.client.send('product.apply-percent-discount', {
        productId: +id,
        percent: body.percent,
      })
    );
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Produto retornado com sucesso',
    schema: zodToOpenAPI(showProductOutputSchema),
  })
  async showProduct(
    @Param(showProductValidationPipe) params: ShowProductDto
  ): Promise<ShowProductOutputDto> {
    return await firstValueFrom(
      this.client.send('product.show-product', params)
    );
  }

  @Delete(':id')
  @HttpCode(204) // AQUI RECEBE RESOISTA MAIS OPTEI POR USAR HTTP 204 para esconder por conta das sugestões
  @ApiNoContentResponse({ description: 'Produto inativado com sucesso' })
  @ApiNotFoundResponse({ description: 'Produto não encontrado ou já inativo' })
  async softDeleteProduct(
    @Param('id', ParseIntPipe) id: number
  ): Promise<void> {
    await firstValueFrom(this.client.send('product.soft.delete', { id }));
  }

  @Post(':id/restore')
  @HttpCode(200) // AQUI RECEBE RESOISTA MAIS OPTEI POR USAR HTTP 204 para esconder por conta das sugestões
  @ApiNoContentResponse({ description: 'Produto restaurado com sucesso' })
  @ApiNotFoundResponse({ description: 'Produto não encontrado ou já ativo' })
  async restoreProduct(
    @Param('id', ParseIntPipe) id: number
  ): Promise<RestoreOutputDto> {
    return await firstValueFrom(this.client.send('product.restore', { id }));
  }

  @Delete(':id/discount')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Desconto removido com sucesso' })
  @ApiNotFoundResponse({
    description: 'Produto não encontrado ou sem desconto registrado',
  })
  async removeDiscount(
    @Param('id', ParseIntPipe) id: number
  ): Promise<RestoreOutputDto> {
    // RestoreOutputDto pode ser substituído por uma interface genérica...
    return await firstValueFrom(
      this.client.send('product.remove.discount', { id })
    );
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiOkResponse({ description: 'Produto atualizado com sucesso' })
  @ApiBadRequestResponse({ description: 'Payload inválido' })
  @ApiNotFoundResponse({ description: 'Produto não encontrado' })
  @ApiPreconditionFailedResponse({ description: 'Produto inativo' })
  @Header('Content-Type', 'application/json-patch+json')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateProductPatchSchema))
    patch: UpdateProductPatchDto
  ): Promise<UpdateProductOutputPatchDto> {
    return await firstValueFrom(
      this.client.send('product.update', { id, patch })
    );
  }
}
