import { api } from "./base";
import { IndexCouponsOutputDto } from "../schemas/index-coupons";

export const fetchCoupons = async (): Promise<IndexCouponsOutputDto> => {
  const res = await api.get("coupons");
  return res.data;
};
