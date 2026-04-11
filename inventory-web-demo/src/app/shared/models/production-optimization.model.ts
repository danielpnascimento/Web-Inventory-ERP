export interface ProductAnalysis {
  id: number;
  code: string;
  product: string;
  maxProduction: number;
  unitPrice: number;
  estimatedRevenue: number;
}

export interface ProductionOptimizationModel {
  productsMaximum: ProductAnalysis[];
  recommendedProduct: string;
}


