import { useQuery } from "@tanstack/react-query";
import { useProductStore } from "../store/product-store";
import { fetchProducts } from "../api/products";
import { IndexProductsOutput } from "../schemas/index-products";

export const useProductQuery = () => {
  const { filters, setProducts, setMeta } = useProductStore();

  const {
    page,
    limit,
    search,
    sortBy,
    sortOrder,
    minPrice,
    maxPrice,
    hasDiscount,
    includeDeleted,
    onlyOutOfStock,
    withCouponApplied,
  } = filters;

  return useQuery<IndexProductsOutput>({
    queryKey: [
      "products",
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      minPrice,
      maxPrice,
      hasDiscount,
      includeDeleted,
      onlyOutOfStock,
      withCouponApplied,
    ],
    queryFn: async () => {
      const result = await fetchProducts(filters);
      setProducts(result.data);
      setMeta(result.meta);
      return result;
    },
    staleTime: 1000 * 60 * 5, // <- nunca refetch automático
    refetchOnMount: false, // <- não refetch mesmo ao montar de novo
    refetchOnWindowFocus: false, // <- não refetch ao voltar pro browser
  });
};
