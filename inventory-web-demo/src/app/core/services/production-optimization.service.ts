import { Injectable } from '@angular/core';
import { ProductAnalysis, ProductionOptimizationModel } from '../../shared/models/production-optimization.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { forkJoin, map, Observable } from 'rxjs';
import { ProductionMaximumService } from './production-maximum.service';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class ProductionOptimizationService {

  private API = `${environment.apiUrl}/products`;

  constructor(
    private http: HttpClient,
    private productionMaximumService: ProductionMaximumService,
    private productService: ProductService
  ) { }

  findAllProductionOptimization(): Observable<ProductionOptimizationModel> {
    if (environment.useMock) {
      return forkJoin({
        maximumProductions: this.productionMaximumService.findAllProductionMaximum(),
        products: this.productService.findAllProduct()
      }).pipe(
        map(({ maximumProductions, products }) => {
          let bestRevenue = 0;
          let bestProduction = 0;
          let recommendedProductName = "";

          const analysis: ProductAnalysis[] = [];

          maximumProductions.forEach(maxProd => {
            const product = products.find(p => Number(p.id) === Number(maxProd.id));
            const price = product?.price || 0;
            const estimatedRevenue = maxProd.maxProduction * price;

            analysis.push({
              id: maxProd.id,
              code: maxProd.code,
              product: maxProd.product,
              maxProduction: maxProd.maxProduction,
              unitPrice: price,
              estimatedRevenue: estimatedRevenue
            });

            if (
              estimatedRevenue > bestRevenue || 
              (estimatedRevenue === bestRevenue && maxProd.maxProduction > bestProduction)
            ) {
              bestRevenue = estimatedRevenue;
              bestProduction = maxProd.maxProduction;
              recommendedProductName = maxProd.product;
            }
          });

          return {
            productsMaximum: analysis,
            recommendedProduct: recommendedProductName
          };
        })
      );
    }

    return this.http.get<ProductionOptimizationModel>(`${this.API}/all-production-optimization`);
  }
}