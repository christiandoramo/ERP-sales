import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct } from '../api/products';
import { CreateProductDto } from '../schemas/create-product';

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductDto) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
