// apps/api-gateway/src/app/presentation/controllers/coupon.controller.ts

import { Controller, Post, Body, Inject, HttpCode, Get, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateCouponDto,createCouponOkResponseSchema,CreateCouponOkResponseDto,createCouponSchema,createCouponValidationPipe } from 'libs/coupon-service.lib/src/lib/presentation/dtos/create-coupon.dto';
import { firstValueFrom } from 'rxjs';
import { zodToOpenAPI } from 'nestjs-zod';
import { ApiBody, ApiOkResponse, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
// import { LocationHeader } from '@erp-coupon-coupon/pipe-config';
import { IndexCouponsDto, IndexCouponsOutputDto, indexCouponsValidationPipe } from 'libs/coupon-service.lib/src/lib/presentation/dtos/index-coupon.dto';

@ApiTags('Cupons')
@Controller('coupons')
export class CouponController {
  constructor(@Inject('COUPON_SERVICE') private readonly client: ClientProxy) {}

  // @LocationHeader()

  @Post()
  @HttpCode(201)
  @ApiBody({
    description: 'Cadastrar cupom',
    schema: zodToOpenAPI(createCouponSchema),
  })
  @ApiResponse({
    status: 201,
    description: 'Cupom cadastrado com sucesso',
    schema: zodToOpenAPI(createCouponOkResponseSchema),
  })
  @ApiResponse({
    status: 400,
    description: 'Requisição inválida (erro no formato da requisição)',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflito: código do cupom já existe',
  })
  async createCoupon(
    @Body(createCouponValidationPipe) body: CreateCouponDto,
  
  ) : Promise<CreateCouponOkResponseDto | null> {
    return await firstValueFrom(this.client.send('coupon.create', body));
  }

  
  @Get()
  @HttpCode(200)
  @ApiQuery({
    description: 'Cadastrar cupom',
    schema: zodToOpenAPI(createCouponSchema),
  })
  @ApiOkResponse({
    description: 'Busca realizada com sucesso',
    schema: zodToOpenAPI(createCouponOkResponseSchema),
  })
  async indexCoupon(
    @Query(indexCouponsValidationPipe) query: IndexCouponsDto,
  
  ) : Promise<IndexCouponsOutputDto> {

    return await firstValueFrom(this.client.send('coupon.index', query));
  }
}