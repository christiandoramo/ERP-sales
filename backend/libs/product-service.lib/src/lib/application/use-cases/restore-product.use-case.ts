import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { ConflictException ,NotFoundException} from '@erp-product-coupon/pipe-config';
import { RestoreOutput } from '../../domain/interfaces/restore.interface';

@Injectable()
export class RestoreProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: number): Promise<RestoreOutput> {
    console.log('Entrou');
    const product = await this.productRepository.showProduct(id);
    if (!product) throw new NotFoundException('Produto não encontrado');
    if (!product?.deletedAt)
      throw new ConflictException('Produto NÃO se encontra inativo');

    await this.productRepository.restoreProduct(id);

    return {
      message: 'O produto foi reativado com sucesso',
      productId: id,
    };
  }
}
