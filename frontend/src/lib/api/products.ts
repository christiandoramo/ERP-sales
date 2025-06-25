// src/lib/api/products.ts
import { IndexProductsOutput, ProductFilters } from '@/lib/schemas/index-products';
import { CreateProductDto } from '../schemas/create-product';

import { api } from './base';
import { UpdateProductPatchDto } from '../schemas/update-product';

export const fetchProducts = async (params: ProductFilters): Promise<IndexProductsOutput> => {
  const response = await api.get('products',  {params} );
  return response.data;
};

export const createProduct = async (data: CreateProductDto) => {
  const res = await api.post('products', data);
  return res.data; // { id: number }
};

export const updateProduct = async (id: number, patch: UpdateProductPatchDto) => {
  const res = await api.patch(`products/${id}`, patch, {
    headers: { 'Content-Type': 'application/json-patch+json' },
  });
  return res.data;
};