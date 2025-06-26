import { ProductListItemOutput } from "./index-product";


export interface ShowProductOutput {
  data: ProductListItemOutput | null;
}

export interface ShowProductInput{
  id:number;
}
