// libs/product-service.lib/src/lib/domain/entities/product.entity.ts
// domain/entities/product.entity.ts
// libs/product-service.lib/src/lib/domain/entities/product.entity.ts

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
    description?: string | null;
  }): Product {
    const now = new Date();
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