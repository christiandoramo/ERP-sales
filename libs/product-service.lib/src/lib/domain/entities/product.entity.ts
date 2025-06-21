// libs/product-service.lib/src/lib/domain/entities/product.entity.ts
// domain/entities/product.entity.ts
// libs/product-service.lib/src/lib/domain/entities/product.entity.ts

import { BadRequestException, UnprocessableEntityException } from "@erp-product-coupon/pipe-config";


// tratar aqui lógica PURA, não de acesso a dados... como seria feito em use-case
export class Product {
  private constructor(
    public readonly id: number,
    public name: string,
    public stock: number,
    public price: number,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public deletedAt: Date | null,
    public description: string | null,
  ) {}

  static create(props: {
    name: string;
    stock: number;
    price: number;
    description: string | null;
  }): Product {
    const now = new Date();
    
    const { name, stock, price } = props;

    // né 422 porque conhece o formato mas não é admitido pelas regras
    if (!name || name.trim().length < 3 || name.trim().length > 100) {
      throw new UnprocessableEntityException(`Comprimento do nome maior ou menor que o permitido.\nComprimento do nome: ${name.length} mas deve ser entre 3 e 100`);
    }

    if (stock < 0 || stock > 999999) {
      throw new UnprocessableEntityException(`Estoque fora dos limites permitidos.\nEstoque: ${stock} mas deve estar entre 0 e 999999`);

    }

    if (price < 0.01 || price > 1000000) {
     throw new UnprocessableEntityException(`Preço fora dos limites permitidos.\nPreço: ${price} mas deve estar entre 0 e 1000000`);
    }


    return new Product(
      0, // id fals o
      props.name.trim(),
      props.stock,
      props.price,
      now,
      now,
      null,
      props.description ?? null,
    );
  }

  static restore(props: {
    id: number;
    name: string;
    stock: number;
    price: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    description: string | null;
  }): Product {
    return new Product(
      props.id,
      props.name,
      props.stock,
      props.price,
      props.createdAt,
      props.updatedAt,
      props.deletedAt,
      props.description,
    );
  }
}
// aqui apenas lógica que não envolva repositório