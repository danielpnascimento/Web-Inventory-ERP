
// interface that represents the materials that are missing for production (MissingMaterialDTO from the backend)
export interface MissingMaterialModel {
  material: string;
  missing: number;
  measure: string;
}

// Interface that represents ALL product materials with required vs. available stock (MaterialSimulationDTO from the backend)
export interface MaterialSimulationModel {
  material: string;
  required: number;
  stock: number;
  measure: string;
}

// interface that represents the materials that are in excess in stock (HighStockMaterialDTO from the backend)
export interface HighStockMaterialModel {
  id: number;
  code: string;
  material: string;
  stock: number;
  measure: string;
}
//(ProductionSimulationDTO from the backend)
// Interface that represents the response from the production simulation API that receives the DTO bills of materials above
// Ex: Mailbox
export interface ProductionSimulationModel {
  id: number;
  code: string;
  product: string;
  requestedQuantity: number;
  possibleQuantity: number;
  limitingMaterial: string;
  missingMaterials: MissingMaterialModel[];
  materials: MaterialSimulationModel[];
  highStockMaterials: HighStockMaterialModel[];
}
