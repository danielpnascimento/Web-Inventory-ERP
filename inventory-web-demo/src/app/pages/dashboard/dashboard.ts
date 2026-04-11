import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MaterialService } from '../../core/services/material.service';
import { DragScrollDirective } from '../../shared/components/directives/drag-scroll.directive';
import { RawMaterialsListModel } from '../../shared/models/raw-materials-list.model';
import { map } from 'rxjs';
import { ProductService } from '../../core/services/product.service';
import { ProductionMaximumService } from '../../core/services/production-maximum.service';
import { ProductionOptimizationService } from '../../core/services/production-optimization.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, AsyncPipe, DragScrollDirective],
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

  private materialService = inject(MaterialService);
  materials$ = this.materialService.findAllMaterial();

  private productService = inject(ProductService);
  products$ = this.productService.findAllProduct();

  private productionMaximumService = inject(ProductionMaximumService);
  productionMaximum$ = this.productionMaximumService.findAllProductionMaximum();

  topProduct$ = this.productionMaximum$.pipe(
    map(list => {
      if (!list || list.length === 0) return null;
      return list.reduce((prev, current) =>
        (prev.maxProduction > current.maxProduction) ? prev : current
      );
    })
  );

  private productionOptimizationService = inject(ProductionOptimizationService);
  productionOptimization$ = this.productionOptimizationService.findAllProductionOptimization();

  topOptimization$ = this.productionOptimization$.pipe(
    map(data => {
      if (!data || !data.productsMaximum) return null;
      return data.productsMaximum.find(p => p.product === data.recommendedProduct);
    })
  );


  materialsSorted$ = this.materials$.pipe(
    map((materials: RawMaterialsListModel[]) =>
      materials.slice().sort((a: RawMaterialsListModel, b: RawMaterialsListModel) =>
        b.quantityInStock - a.quantityInStock
      )
    )
  );

}



