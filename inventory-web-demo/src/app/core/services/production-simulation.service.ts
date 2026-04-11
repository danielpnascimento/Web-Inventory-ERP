import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProductionSimulationModel, MissingMaterialModel, MaterialSimulationModel, HighStockMaterialModel } from '../../shared/models/production-simulation.model';
import { ProductService } from './product.service';
import { MaterialService } from './material.service';

@Injectable({
  providedIn: 'root'
})
export class ProductionSimulationService {

  private API = `${environment.apiUrl}/products`;

  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private materialService: MaterialService
  ) { }

  simulate(productId: number, quantity: number): Observable<ProductionSimulationModel> {
    if (environment.useMock) {
      return forkJoin({
        productWithComps: this.productService.findByIdProduct(productId),
        allMaterials: this.materialService.findAllMaterial()
      }).pipe(
        map(({ productWithComps, allMaterials }) => {
          if (!productWithComps) {
             throw new Error("Product not found");
          }

          const requestedQuantity = quantity;
          let possibleQuantity = 0;
          let limitingMaterialName: string | null = null;
          
          const missingMaterials: MissingMaterialModel[] = [];
          const materialsConsumption: MaterialSimulationModel[] = [];
          const highStockMaterials: HighStockMaterialModel[] = [];

          let maxProduction = Number.MAX_VALUE;

          const compositions = productWithComps.compositions || [];

          for (const comp of compositions) {
            const material = allMaterials.find(m => Number(m.id) === Number(comp.rawMaterial.id));
            if (!material) continue;
            const stockInBase = this.convertToBaseUnit(material.quantityInStock, material.measure || '');
            const requiredPerUnitInBase = this.convertToBaseUnit(comp.quantityRequired, comp.measure);
            const totalRequiredInBase = requiredPerUnitInBase * requestedQuantity;

            materialsConsumption.push({
              material: material.name || '',
              required: totalRequiredInBase,
              stock: stockInBase,
              measure: comp.measure
            });

            if (stockInBase < totalRequiredInBase) {
              const missing = totalRequiredInBase - stockInBase;
              
              missingMaterials.push({
                material: material.name || '',
                missing: missing
              });

              if (!limitingMaterialName) {
                limitingMaterialName = material.name;
              }
            }
            if (requiredPerUnitInBase > 0) {
              const possible = Math.floor(stockInBase / requiredPerUnitInBase);
              if (possible < maxProduction) {
                maxProduction = possible;
              }
            }

            if (stockInBase > totalRequiredInBase) {
              highStockMaterials.push({
                id: Number(material.id) || 0,
                code: material.code || '',
                material: material.name || '',
                stock: stockInBase,
                measure: material.measure || ''
              });
            }
          }

          possibleQuantity = maxProduction === Number.MAX_VALUE ? 0 : maxProduction;

          if (!limitingMaterialName) {
            limitingMaterialName = "SUFFICIENT_STOCK";
          }

          return {
            id: Number(productWithComps.id) || 0,
            code: productWithComps.code || '',
            product: productWithComps.name || '',
            requestedQuantity: requestedQuantity,
            possibleQuantity: possibleQuantity,
            limitingMaterial: limitingMaterialName,
            missingMaterials: missingMaterials,
            materials: materialsConsumption,
            highStockMaterials: highStockMaterials
          };
        })
      );
    }

    return this.http.get<ProductionSimulationModel>(
      `${this.API}/simulate/${productId}`,
      { params: { quantity } }
    );
  }

  private convertToBaseUnit(value: number, measure: string): number {
    const lowerMeasure = measure?.toLowerCase() || '';
    if (lowerMeasure === 'kg' || lowerMeasure === 'kilogram' || lowerMeasure === 'kilograma') {
      return value * 1000;
    } else if (lowerMeasure === 'l' || lowerMeasure === 'liter' || lowerMeasure === 'litro') {
      return value * 1000;
    }
    return value;
  }

}
