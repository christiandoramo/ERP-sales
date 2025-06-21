// libs/product-service.lib/src/lib/domain/interfaces/create-product.interface.ts
export interface CreateProductInput{
  name: string;
  stock: number,
  price: number,
  description: string | null
}