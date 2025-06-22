// apps/product-service/src/app/infra/filters/rpc-domain-exception.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { DomainException } from '@erp-product-coupon/pipe-config';

@Catch()
export class RpcDomainExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): Observable<any> {
    if (exception instanceof DomainException) {
      return throwError(() => new RpcException({
        statusCode: exception.statusCode,
        message: exception.message,
      }));
    }

    if (exception instanceof RpcException) {
      return throwError(() => exception); // já está formatado
    }

    return throwError(() => new RpcException({
      statusCode: 500,
      message: 'Erro inesperado',
    }));
  }
}