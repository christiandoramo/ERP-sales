import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/base";

export const useApplyCoupon = (productId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (couponCode: string) =>
      api.post(`/products/${productId}/discount/coupon`, { couponCode }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
export const useApplyPercent = (productId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (percent: number) =>
      api.post(`/products/${productId}/discount/percent`, { percent }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
