// libs/product-service.lib/src/lib/domain/entities/product.entity.ts
import { UnprocessableEntityException } from '../../../../../../shared/pipe-config/src/index';

// tratar aqui lógica PURA, não de acesso a dados... como seria feito em use-case
export class Product {
  public constructor(
    public readonly id: number,
    public name: string,
    public stock: number,
    public price: number,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public deletedAt: Date | null,
    public description: string | null
  ) {
    Product.validate({
      name,
      stock,
      price,
      description,
    });
  }

  static validate(props: {
    name: string;
    stock: number;
    price: number;
    description: string | null;
  }) {
    const { name, stock, price } = props;

    // né 422 porque conhece o formato mas não é admitido pelas regras
    if (!name || name.trim().length < 3 || name.trim().length > 100) {
      throw new UnprocessableEntityException(
        `Comprimento do nome maior ou menor que o permitido.\nComprimento do nome: ${name.length} mas deve ser entre 3 e 100`
      );
    }

    if (stock < 0 || stock > 999999) {
      throw new UnprocessableEntityException(
        `Estoque fora dos limites permitidos.\nEstoque: ${stock} mas deve estar entre 0 e 999999`
      );
    }

    if (price < 0.01 || price > 1000000) {
      throw new UnprocessableEntityException(
        `Preço fora dos limites permitidos.\nPreço: ${price} mas deve estar entre 0 e 1000000`
      );
    }

    if (!!props?.description)
      if (props?.description?.length > 300)
        throw new UnprocessableEntityException(
          `Descrição muito grande, maior que 300 caracteres`
        );
  }

  static create(props: {
    name: string;
    stock: number;
    price: number;
    description: string | null;
  }): Product {
    const now = new Date();

    Product.validate(props);

    return new Product(
      0, // id fals o
      props.name.trim(),
      props.stock,
      props.price,
      now,
      now,
      null,
      props.description ?? null
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
    Product.validate(props);

    return new Product(
      props.id,
      props.name,
      props.stock,
      props.price,
      props.createdAt,
      props.updatedAt,
      props.deletedAt,
      props.description
    );
  }
}
// aqui apenas lógica que não envolva repositório
