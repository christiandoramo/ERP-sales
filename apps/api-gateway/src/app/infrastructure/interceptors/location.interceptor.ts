import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { LOCATION_HEADER } from '@erp-product-coupon/pipe-config';

@Injectable()
export class LocationHeaderInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isLocationEnabled = this.reflector.getAllAndOverride<boolean>(
      LOCATION_HEADER,
      [context.getHandler(), context.getClass()],
    );

    if (!isLocationEnabled) return next.handle();

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        if (
          request.method === 'POST' &&
          response.statusCode === 201 &&
          data?.id
        ) {
          const baseUrl = request.baseUrl || request.originalUrl || '';
          response.setHeader('Location', `${baseUrl}/${data.id}`);
        }
        return data;
      }),
    );
  }
}
