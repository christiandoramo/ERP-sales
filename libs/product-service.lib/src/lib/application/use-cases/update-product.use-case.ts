import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/product.repository';
import {
  BadRequestException,
  NotFoundException,
  PreConditionException,
  UnknowErrorException,
} from '@erp-product-coupon/pipe-config';
import { Product } from '../../domain/entities/product.entity';
import { applyPatch } from 'fast-json-patch';

@Injectable()
export class UpdateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(productId: number, patch: any[]): Promise<Product> {
    const existing = await this.productRepository.getProductWithDiscount(
      productId
    );

    if (!existing) {
      throw new NotFoundException('Produto não encontrado');
    }

    // deixar essa regra para depois - não vai poder atualizar produtos desativados
    if (existing.deletedAt) {
      throw new PreConditionException(
        'Produto já está inativo - APENAS admins podem atualizar'
      );
    }

    const mutable = {
      name: existing.name,
      description: existing.description,
      stock: existing.stock,
      price: existing.price,
      isActive: existing.deletedAt === null, // esse é o existente achado no banco
    };

    const result = applyPatch(mutable, patch, true);
    const updatedData = result.newDocument;

    Product.validate(updatedData); // Valida As regras da entidade

    const discount = existing.discount; // pode ser nulo
    const totalDiscountValue =
      discount != null
        ? discount.type === 'fixed'
          ? discount.value
          : (existing.price * discount.value) / 100
        : 0;

    const finalPrice =
      discount != null
        ? Math.max(0, +(existing.price - totalDiscountValue).toFixed(2))
        : existing.price;

    if (finalPrice < 0.01)
      throw new UnprocessableEntityException(
        `O valor é tão baixo, que um desconto torna o valor abaixo de 0.01.\nO desconto registrado é de: ${totalDiscountValue}`
      );

    const partialUpdate: Partial<Product> = {
      name: updatedData.name,
      description: updatedData.description,
      stock: updatedData.stock,
      price: updatedData.price,
      deletedAt: updatedData.isActive ? null : new Date(),
    };

    const updated = await this.productRepository.updateProduct(
      productId,
      partialUpdate
    );

    if (!updated) {
      throw new UnknowErrorException(
        'Ocorreu um erro dsconhecido ao atualizar o produto'
      );
    }

    return updated;
  }
}
