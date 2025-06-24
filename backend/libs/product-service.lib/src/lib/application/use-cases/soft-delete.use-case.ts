import {
  Injectable,
} from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { NotFoundException, ConflictException} from '@erp-product-coupon/pipe-config';
import { SoftDeleteOutput} from '../../domain/interfaces/soft-delete.interface';

@Injectable()
export class SoftDeleteProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: number): Promise<SoftDeleteOutput>  {
    console.log('aqui: 2', id, typeof id);

    const product = await this.productRepository.showProduct(id);
    if (!product) throw new NotFoundException('Produto não encontrado');
    if (!!product?.deletedAt)
      throw new ConflictException('Produto já está inativo');

    await this.productRepository.softDeleteProduct(id);
    return {
        message: "O produto foi desativado com sucesso",
        productId: id,
    }
  }
}
