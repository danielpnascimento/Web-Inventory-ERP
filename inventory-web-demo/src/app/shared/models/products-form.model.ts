import { ProductCompositionModel } from "./product-composition-model";

export class ProductsFormModel {
  id: number | null = null;
  code: string | null = null;
  name: string = '';
  price: number = 0;
  compositions: ProductCompositionModel[] = [];
}


