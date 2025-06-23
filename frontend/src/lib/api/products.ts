// src/lib/api/products.ts
import { IndexProductsOutput, ProductFilters } from '@/lib/schemas/index-products';
import { api } from './base';

export const fetchProducts = async (params: ProductFilters): Promise<IndexProductsOutput> => {
  const response = await api.get('products',  {params} );
  return response.data;
};
