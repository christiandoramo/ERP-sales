import { useQuery } from "@tanstack/react-query";
import { fetchCoupons } from "../api/coupons";

export const useCoupons = () => {
  return useQuery({
    queryKey: ["coupons"],
    queryFn: fetchCoupons,
  });
};
