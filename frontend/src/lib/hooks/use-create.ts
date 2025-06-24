import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct } from '../api/products';
import { CreateProductInput } from '../schemas/create-product';

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductInput) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
