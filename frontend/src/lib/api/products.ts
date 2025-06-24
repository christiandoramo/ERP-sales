// src/lib/api/products.ts
import { IndexProductsOutput, ProductFilters } from '@/lib/schemas/index-products';
import { CreateProductInput } from '../schemas/create-product';

import { api } from './base';

export const fetchProducts = async (params: ProductFilters): Promise<IndexProductsOutput> => {
  const response = await api.get('products',  {params} );
  return response.data;
};

export const createProduct = async (data: CreateProductInput) => {
  const res = await api.post('products', data);
  return res.data; // { id: number }
};
