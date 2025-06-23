// src/lib/hooks/use-products-query.ts
import { useQuery } from '@tanstack/react-query';
import { useProductStore } from '../store/product-store';
import { fetchProducts } from '../api/products';
import { IndexProductsOutput } from '../schemas/index-products';

export const useProductQuery = () => {
  const { filters, setProducts, setMeta } = useProductStore();

  return useQuery<IndexProductsOutput>({
    queryKey: ['products', filters],
    queryFn: async () => {
      const result = await fetchProducts(filters); // retorna IndexProductsOutput
      setProducts(result.data);
      setMeta(result.meta);
      return result;
    },
    placeholderData: {
      data: [],
      meta: {
        page: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 0,
      },
    },
  });
};
