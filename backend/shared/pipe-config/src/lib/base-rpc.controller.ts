// shared/pipe-config/src/lib/base-rpc.controller.ts
import { RpcException } from '@nestjs/microservices';
import { DomainException } from '@erp-product-coupon/pipe-config';

export function wrapRpc<T extends (...args: any[]) => Promise<any>>(handler: T): T {
  return (async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      if (error instanceof DomainException) {
        throw new RpcException({ message: error.message, statusCode: error.statusCode });
      }
      throw error;
    }
  }) as T;
}
