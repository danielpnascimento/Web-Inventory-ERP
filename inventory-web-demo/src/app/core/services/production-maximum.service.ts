import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProductionMaximumModel } from '../../shared/models/production-maximum.model';
import { ProductService } from './product.service';
import { MaterialService } from './material.service';
import { CsvService } from './csv.service';

@Injectable({
  providedIn: 'root'
})
export class ProductionMaximumService {

  private API = `${environment.apiUrl}/products`;

  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private materialService: MaterialService,
    private csvService: CsvService
  ) { }
 
  findAllProductionMaximum(): Observable<ProductionMaximumModel[]> {
    if (environment.useMock) {
      return forkJoin({
        products: this.productService.findAllProduct(),
        materials: this.materialService.findAllMaterial(),
        compositions: this.csvService.load('product_compositions')
      }).pipe(
        map(({ products, materials, compositions }) => {
          const formattedCompositions = compositions.map(c => {
             const values = Object.values(c);
             return {
                id: Number(values[0]) || 0,
                quantityRequired: Number(values[1]) || 0,
                productId: Number(values[2]) || 0,
                rawMaterialId: Number(values[3]) || 0,
                measure: String(values[4] || '')
             };
          });

          return products.map(product => {
            try {
              const productComps = formattedCompositions.filter(c => Number(c.productId) === Number(product.id));

              if (productComps.length === 0) {
                return {
                  id: Number(product.id) || 0,
                  code: product.code || '',
                  product: product.name || '',
                  maxProduction: 0,
                  limitingMaterial: "N/A (No Ingredients)",
                  missingQuantity: 0,
                  measure: ''
                };
              }

              let maxProduction = Number.MAX_VALUE;
              let limitingMaterialName = "";
              let missingQuantity = 0;
              let limitingMeasure = "";

              for (const comp of productComps) {
                 const rawMaterial = materials.find(m => Number(m.id) === Number(comp.rawMaterialId));
                 if (!rawMaterial) continue;

                 const stockInBase = this.convertToBaseUnit(rawMaterial.quantityInStock, rawMaterial.measure || '');
                 const requiredInBase = this.convertToBaseUnit(comp.quantityRequired, comp.measure);

                 if (requiredInBase <= 0) continue;

                 const possible = Math.floor(stockInBase / requiredInBase);

                 if (possible < maxProduction) {
                   maxProduction = possible;
                   limitingMaterialName = rawMaterial.name || '';
                   limitingMeasure = rawMaterial.measure || '';

                   const neededForNext = requiredInBase * (possible + 1);
                   missingQuantity = neededForNext - stockInBase;
                 }
              }

              if (maxProduction === Number.MAX_VALUE) {
                maxProduction = 0;
              }

              return {
                  id: Number(product.id) || 0,
                  code: product.code || '',
                  product: product.name || '',
                  maxProduction: maxProduction,
                  limitingMaterial: limitingMaterialName,
                  missingQuantity: missingQuantity,
                  measure: limitingMeasure
              };
            } catch (e) {
              console.error('Erro ao calcular item:', product.id, e);
              return {
                  id: Number(product.id) || 0,
                  code: product.code || '',
                  product: product.name || '',
                  maxProduction: 0,
                  limitingMaterial: "Error in Calculation",
                  missingQuantity: 0,
                  measure: ''
              };
            }
          });
        })
      );
    }

    return this.http.get<ProductionMaximumModel[]>(`${this.API}/all-maximum-production`);
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
