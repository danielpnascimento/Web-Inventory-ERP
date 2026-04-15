import { Component, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { ProductionSimulationService } from '../../core/services/production-simulation.service';
import { ProductsListModel } from '../../shared/models/products-list.model';
import { ProductionSimulationModel } from '../../shared/models/production-simulation.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-production-simulation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './production-simulation.html',
  styleUrl: './production-simulation.scss',
})
export class ProductionSimulation implements OnInit {

  private productService = inject(ProductService);
  private simulationService = inject(ProductionSimulationService);

  products: ProductsListModel[] = [];
  productId: number | null = null;
  quantity: number | null = null;
  result: ProductionSimulationModel | null = null;
  loading = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.productService.findAllProduct().subscribe(data => {
      this.products = data;
    });
  }

  simulate() {
    if (!this.productId || !this.quantity || this.loading) return;

    this.loading = true;
    this.result = null;

    const activeElement = document.activeElement as HTMLElement;
    if (activeElement) {
      activeElement.blur();
    }

    this.simulationService.simulate(this.productId, this.quantity).subscribe({
      next: (data: ProductionSimulationModel) => {
        this.result = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  // function that allows pressing enter with the button without clicking the mouse.
  @HostListener('document:keydown.enter')
  handleEnter() {
    if (!this.productId || !this.quantity || this.loading) return;

    this.simulate();
  }

  get isInsufficient(): boolean {
    // !! converts to true boolean (avoids type error with TypeScript strict)
    return !!this.result && this.result.limitingMaterial !== 'SUFFICIENT_STOCK';
  }

  get isSufficient(): boolean {
    return !!this.result && this.result.limitingMaterial === 'SUFFICIENT_STOCK';
  }

}


