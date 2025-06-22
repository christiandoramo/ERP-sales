// shared/pipe-config/src/lib/rpc-exception-adapter.ts
import { RpcException } from '@nestjs/microservices';
import { DomainException } from '@erp-product-coupon/pipe-config';

export function toRpc(exception: DomainException): never {
  throw new RpcException({
    statusCode: exception.statusCode,
    message: exception.message,
  });
}