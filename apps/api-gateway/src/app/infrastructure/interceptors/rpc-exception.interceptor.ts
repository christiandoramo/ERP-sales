// apps/api-gateway/src/app/infrastructure/interceptors/rpc-exception.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class RpcExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof RpcException) {
          const res = error.getError() as any;

          console.error('[RPC ERROR]', res);

          if (res?.statusCode && res?.message) {
            return throwError(
              () => new HttpException(res.message, res.statusCode)
            );
          }

          return throwError(
            () => new HttpException('Erro interno do servidor', 500)
          );
        }

        console.error('[GENERIC ERROR]', error);
        return throwError(() => error);
      })
    );
  }
}
