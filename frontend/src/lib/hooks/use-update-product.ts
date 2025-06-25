// src/lib/hooks/use-update-product.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "../api/products";
import { UpdateProductPatchDto } from "../schemas/update-product";

interface UpdateProductArgs {
  id: number;
  patch: UpdateProductPatchDto;
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, patch }: UpdateProductArgs) => updateProduct(id, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
